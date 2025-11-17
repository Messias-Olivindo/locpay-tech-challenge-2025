import { Module } from '@nestjs/common';
import { OperationsModule } from './operations/operations.module';
import { ReceiversModule } from './receivers/receivers.module';

@Module({
  imports: [OperationsModule, ReceiversModule],
})
export class AppModule {}
