import { Document } from 'mongoose';

export interface IUser extends Document {
    readonly id: string;
    readonly email: string;
    readonly password: string;
    readonly displayName: string;
    readonly isUser: boolean;
    readonly isAdmin: boolean;
    readonly isModerator: boolean;
    readonly isActive: boolean;
    readonly regData: Date;
    readonly lastLogin: Date;
}