import { Prisma, Status } from "generated/prisma/client";
import { ReceiverEntity } from "src/receivers/entity/receiver.entity";


export class OperationEntity {
    id: string;
    receiverId: string;
    grossValue: Prisma.Decimal;
    fee: Prisma.Decimal;
    netValue: Prisma.Decimal;
    status: Status;
}
