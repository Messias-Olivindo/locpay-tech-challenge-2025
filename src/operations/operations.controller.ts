import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDTO } from './dto/createOperation.dto';
import { OperationEntity } from './entity/operation.entity';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  /**
   * POST /operations
   * Cria uma operação de antecipação,
   *
   * @param {CreateOperationDTO} operation - DTO com a operação a ser criada
   * @returns {Promise<OperationEntity>} - Operação criada
   * @throws {BadRequestException} - Se a validação do DTO falhar
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() operation: CreateOperationDTO): Promise<OperationEntity> {
    return this.operationsService.create(operation);
  }

  /**
   * GET /operations/:id
   * Retorna os dados de uma operação
   *
   * @param {string} operationId - Id (uuid) da operação a ser buscada
   * @returns {Promise<OperationEntity>} - Operação encontrada
   * @throws {NotFoundException} - Caso nenhum operação seja encontrada
   * @throws {InternalServerErrorException} - Se o erro não for identificado
   * @throws {BadRequestException} - Se a validação do id como UUID falhar
   */
  @Get(':id')
  getById(
    @Param('id', new ParseUUIDPipe()) operationId: string,
  ): Promise<OperationEntity> {
    return this.operationsService.getById(operationId);
  }

  /**
   * POST /operations/:id/confirm
   * Confrima a operação e soma o valor líquido ao saldo do recebedor
   *
   * @param {string} operationId - Id (uuid) da operação que será confirmada
   * @returns {Promise<OperationEntity>} - Operação confirmada junto com os dados do recebedor
   * @throws {BadRequestException} - Caso não haja um operação com o id dado e o status pendente ou se a validação do id como UUID falhar.
   * @throws {InternalServerErrorException} - Se a transação falhar.
   */
  @Post(':id/confirm')
  confirm(
    @Param('id', new ParseUUIDPipe()) operationId: string,
  ): Promise<OperationEntity> {
    return this.operationsService.confirm(operationId);
  }
}
