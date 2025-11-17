import { Module } from '@nestjs/common';
import { ReceiversService } from './receivers.service';
import { ReceiversController } from './receivers.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ReceiversController],
  providers: [ReceiversService, PrismaService],
})
export class ReceiversModule {}
