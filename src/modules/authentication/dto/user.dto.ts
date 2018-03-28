import { Exclude, Type } from 'class-transformer';
import {IsBoolean, IsDate, IsEmail, IsNotEmpty, MaxLength, MinLength} from 'class-validator';
import {User} from "../classes/user";

export class UserDto {
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
}

export class UserOutsideDto {
    id: string;

    @IsNotEmpty()
    @MaxLength(254, {message: 'Максимальная длина поля 255 символов'})
    @IsEmail()
    email: string;

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
}

export class UserInsideDto {
    @IsNotEmpty()
    @MaxLength(254, {message: 'Максимальная длина поля 255 символов'})
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6, {message: 'Минимальная длинна поля не менее 6 символов'})
    @MaxLength(30, {message: 'Максимальная длинна поля не более 30 символов'})
    password: string;
}

export class UserTokenOutsideDto {
    @Type(() => UserOutsideDto)
    user: UserOutsideDto;
    token: {
        expires_in: any;
        token: string;
    };
}