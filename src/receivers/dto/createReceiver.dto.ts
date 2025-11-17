import { IsDecimal, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class createReceiverDTO {
    @IsNotEmpty()
    @IsString()
    name: string;
}