import { Exclude } from 'class-transformer';
import {IsBoolean, IsDate, IsEmail, IsNotEmpty, MaxLength, MinLength} from 'class-validator';
import * as hashers from 'node-django-hashers';

export class User {
    id: string;

    @IsNotEmpty()
    @MaxLength(254, {message: 'Максимальная длина поля 255 символов'})
    @IsEmail()
    email: string;

    @Exclude()
    @IsNotEmpty()
    @MinLength(6, {message: 'Минимальная длинна поля не менее 6 символов'})
    @MaxLength(30, {message: 'Максимальная длинна поля не более 30 символов'})
    password: string;

    @IsNotEmpty()
    @MaxLength(30, {message: 'Максимальная длинна поля не более 30 символов'})
    displayName: string;

    @IsBoolean()
    isUser: boolean;

    @IsBoolean()
    isAdmin: boolean;

    @IsBoolean()
    isModerator: boolean;

    @IsBoolean()
    isActive: boolean;

    @IsNotEmpty()
    @IsDate()
    regData: Date;

    @IsDate()
    lastLogin: Date;

    makePassword(password: string) {
        let h = new hashers.PBKDF2PasswordHasher();
        let hash = h.encode(password, h.salt());
        return hash;
    }

    verifyPassword(password: string) {
        let h = new hashers.PBKDF2PasswordHasher();
        return h.verify(password, this.password);
    }

    setPassword(password: string) {
        if (password) {
            this.password = this.makePassword(password);
        }
    }
}