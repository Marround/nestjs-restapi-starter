import { IsNotEmpty } from 'class-validator';

export class File {
    id: string;

    @IsNotEmpty()
    path: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    alt: string;

    @IsNotEmpty()
    description: string;

    get fullPath() {
        return this.path + this.name;
    }

    constructor(id, path, name, alt, description) {
        this.id = id;
        this.path = path;
        this.name = name;
        this.alt = alt;
        this.description = description;
    }
}