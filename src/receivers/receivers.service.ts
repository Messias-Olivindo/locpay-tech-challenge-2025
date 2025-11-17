import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createReceiverDTO } from './dto/createReceiver.dto';
import { ReceiverEntity } from './entity/receiver.entity';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ReceiversService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Cria um novo recebedor
   *
   * @param {createReceiverDTO} - Dados de nome
   * @returns {Promise<ReceiverEntity>} - Recebedor criado
   */
  async create({ name }: createReceiverDTO): Promise<ReceiverEntity> {
    const receiver = await this.prismaService.receiver.create({
      data: {
        name,
      },
      include: { operations: true },
    });
    return receiver;
  }

  /**
   * Procura um recebedor pelo id fornecido
   *
   * @param {string} receiverId - Id (uuid) do recebedor
   * @returns {Promise<ReceiverEntity>} - Recebedor encontrado
   * @throws {NotFoundException} - Se nada for encontrado com o id
   * @throws {InternalServerErrorException} - Caso o erro não seja identificado
   */
  async getById(receiverId: string): Promise<ReceiverEntity> {
    try {
      const receiver = await this.prismaService.receiver.findUniqueOrThrow({
        where: { id: receiverId },
        include: { operations: true },
      });
      return receiver;
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
}
