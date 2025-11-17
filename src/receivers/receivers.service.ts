import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createReceiverDTO } from './dto/createReceiver.dto';
import { ReceiverEntity } from './entity/receiver.entity';

@Injectable()
export class ReceiversService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Cria um novo recebedor
   * 
   * @param {createReceiverDTO} - Dados de nome
   * @returns {Promise<ReceiverEntity>} - Recebedor criado
   */
  async create({name}:createReceiverDTO): Promise<ReceiverEntity>{
    const receiver = await this.prismaService.receiver.create({data: {
      name
    }});
    return receiver;
  }

  /**
   * Procura um recebedor pelo id fornecido
   * 
   * @param {string} receiverId - Id (uuid) do recebedor
   * @returns {Promise<ReceiverEntity>} - Recebedor encontrado
   * @throws {NotFoundException} - Se nada for encontrado com o id
   */
  async getById(receiverId: string): Promise<ReceiverEntity>{
    const receiver = await this.prismaService.receiver.findUniqueOrThrow({
      where: {id: receiverId},
    })
    return receiver;
  }
}
