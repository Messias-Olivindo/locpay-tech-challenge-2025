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
import { createOperationDto } from './dto/createOperation.dto';
import { OperationEntity } from './entity/operation.entity';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  /**
   * POST /operations
   * Cria uma operação de antecipação,
   * 
   * @param {createOperationDto} operation - DTO com a operação a ser criada
   * @returns {Promise<OperationEntity>} - Operação criada
   * @throws {BadRequestException} - Se a validação do DTO falhar
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() operation: createOperationDto,
  ): Promise<OperationEntity> {
    return  this.operationsService.create(operation);
  }

  /**
   * GET /operations/:id
   * Retorna os dados de uma operação
   * 
   * @param {string} operationId - Id (uuid) da operação a ser buscada
   * @returns {Promise<OperationEntity>} - Operação encontrada
   * @throws {BadRequestException} - Caso o id não seja um UUID válido
   * @throws {NotFoundException} - Caso nenhum operação seja encontrada
   */
  @Get(':id')
  get(
    @Param('id', new ParseUUIDPipe()) operationId: string,
  ): Promise<OperationEntity> {
    return  this.operationsService.get(operationId);
  }

  /**
   * POST /operations/:id/confirm
   * Confrima a operação e soma o valor líquido ao saldo do recebedor
   * 
   * @param {string} operationId - Id (uuid) da operação que será confirmada
   * @returns {Promise<OperationEntity>} - Operação confirmada junto com os dados do recebedor
   * @throws {BadRequestException} - Caso o id não for um UUID válido.
   * @throws {InternalServerErrorException} - Se a transação falhar.
   */
  @Post(':id/confirm')
  confirm(
    @Param('id', new ParseUUIDPipe()) operationId: string,
  ): Promise<OperationEntity> {
    return  this.operationsService.confirm(operationId);
  }
}
