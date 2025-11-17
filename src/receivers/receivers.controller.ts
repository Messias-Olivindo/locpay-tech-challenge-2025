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
import { ReceiversService } from './receivers.service';
import { createReceiverDTO } from './dto/createReceiver.dto';
import { ReceiverEntity } from './entity/receiver.entity';

@Controller('receivers')
export class ReceiversController {
  constructor(private readonly receiversService: ReceiversService) {}

  /**
   * POST /receivers
   * Cria um recebedor
   *
   * @param {createReceiverDTO} receiver - DTO com o recebedor a ser criado
   * @returns {Promise<ReceiverEntity>} - Recebedor criado
   * @throws {BadRequestException} - Se a validação do DTO falhar
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() receiver: createReceiverDTO): Promise<ReceiverEntity> {
    return this.receiversService.create(receiver);
  }

  /**
   * GET /receivers/:id
   * Busca um recebedor pelo id
   *
   * @param {string} receiverId - Id (uuid) do recebedor a ser buscado
   * @returns {Promise<ReceiverEntity>} - Recebedor encontrado
   * @throws {NotFoundException} - Se nada for encontrado com o id
   * @throws {InternalServerErrorException} - Caso o erro não seja identificado
   * @throws {BadRequestException} - Se a validação do Id como UUID falhar
   */
  @Get(':id')
  getById(
    @Param('id', new ParseUUIDPipe()) receiverId: string,
  ): Promise<ReceiverEntity> {
    return this.receiversService.getById(receiverId);
  }
}
