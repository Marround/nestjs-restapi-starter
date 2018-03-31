import { Document } from 'mongoose';

export interface IFile extends Document {
    readonly id: string;
    readonly path: string;
    readonly name: string;
    readonly alt: string;
    readonly description?: string;
}