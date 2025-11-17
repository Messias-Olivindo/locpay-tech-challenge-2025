import { IsDecimal, isDecimal, IsNotEmpty, isNotEmpty, IsUUID } from "class-validator";

export class createOperationDto {
    @IsUUID()
    @IsNotEmpty()
    receiverId: string;

    @IsNotEmpty()
    @IsDecimal({decimal_digits: '2'})
    grossValue: string;
}