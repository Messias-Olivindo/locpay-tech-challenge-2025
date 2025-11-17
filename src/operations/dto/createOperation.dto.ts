import { IsDecimal, IsNotEmpty, IsUUID } from "class-validator";

export class CreateOperationDTO {
    @IsUUID()
    @IsNotEmpty()
    receiverId: string;

    @IsNotEmpty()
    @IsDecimal({decimal_digits: '2'})
    grossValue: string;
}