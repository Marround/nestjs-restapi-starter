import {IsNotEmpty} from "class-validator";

export class FileDto {
    id?: string;

    @IsNotEmpty()
    path: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    alt: string;

    @IsNotEmpty()
    description: string;
}