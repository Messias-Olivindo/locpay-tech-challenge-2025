import { Prisma } from "generated/prisma/client";
import { OperationEntity } from "src/operations/entity/operation.entity"

export class ReceiverEntity {
    id: string;
    name: string;
    balance: Prisma.Decimal;
    operations: OperationEntity[];
}