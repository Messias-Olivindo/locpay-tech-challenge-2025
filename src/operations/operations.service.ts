import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOperationDTO } from './dto/createOperation.dto';
import { OperationEntity } from './entity/operation.entity';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class OperationsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Cria uma nova operação
   * Calcula a taxa (3%) e o valor líquido
   *
   * @param {CreateOperationDTO} - Dados do id do recebedor (receiverId) e valor bruto (grossValue)
   * @returns {Promise<OperationEntity>} - Entidade da operação criada
   */
  async create({
    receiverId,
    grossValue,
  }: CreateOperationDTO): Promise<OperationEntity> {
    const decimalGrossValue = new Prisma.Decimal(grossValue);

    // Calcula o valor da taxa de antecipação
    const taxFee = new Prisma.Decimal('0.03');
    const fee = Prisma.Decimal.mul(decimalGrossValue, taxFee);
    const feeRounded = fee.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);

    // Calcula o valor líquido a ser repassado
    const netValue = Prisma.Decimal.sub(decimalGrossValue, feeRounded);
    const netValueRounded = netValue.toDecimalPlaces(
      2,
      Prisma.Decimal.ROUND_HALF_UP,
    );

    const operation = await this.prismaService.operation.create({
      data: {
        fee: feeRounded,
        grossValue: decimalGrossValue,
        netValue: netValueRounded,
        receiverId,
      },
    });
    return operation;
  }

  /**
   * Procura um operação a partir do id fornecido
   *
   * @param {string} operationId - Id (uuid) da operação
   * @returns {Promise<OperationEntity>} - Operação encontrada
   * @throws {NotFoundException} - Se nada for encontrado com o id
   * @throws {InternalServerErrorException} - Se o erro não for identificado
   */
  async getById(operationId: string): Promise<OperationEntity> {
    try {
      const operation = await this.prismaService.operation.findUniqueOrThrow({
        where: { id: operationId },
      });
      return operation;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * Confirma uma operação
   * Atualiza a operação e o recebedor por meio de uma transação
   * 1. Muda o status da Operação para 'confimed'
   * 2. Adiciona o valor líquido ao saldo do recebedor
   *
   * @param {string} operationId - Id (uuid) da operação a ser confirmada
   * @returns {Promise<OperationEntity>} - Retorna a operação incluindo os dados do recebedor
   * @throws {BadRequestException} - Caso não seja encontrado uma operação com o id e status pendente correspondente
   * @throws {InternalServerErrorException} - Caso ocorra algum erro
   */
  async confirm(operationId: string): Promise<OperationEntity> {
    try {
      // Realiza as operações de atualizar o status da operação e o saldo do recebedor em uma transação
      await this.prismaService.$transaction(async (tx) => {
        const operation = await tx.operation.update({
          where: { id: operationId, status: 'pending' },
          data: { status: 'confirmed' },
        });
        await tx.receiver.update({
          where: { id: operation.receiverId },
          data: { balance: { increment: operation.netValue } },
        });
      });

      // Retorna a operação e o recebedor atualizado
      const updatedOperation =
        await this.prismaService.operation.findUniqueOrThrow({
          where: { id: operationId },
          include: { receiver: true },
        });
      return updatedOperation;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new BadRequestException();
      }
      throw new InternalServerErrorException();
    }
  }
}
