import { Component, Inject } from '@nestjs/common';
import {User} from "../classes/user";
import { Model } from 'mongoose';
import { TokenService } from './token.service';
import {IUser} from "../interfaces/user.interface";
import {UserDto, UserOutsideDto, UserTokenOutsideDto} from "../dto/user.dto";
import {classToClass, plainToClass} from "class-transformer";

@Component()
export class AuthService {
    constructor(
        @Inject('UserModelToken') private readonly userModel: Model<IUser>,
        private readonly tokenService: TokenService
    ) {}

    async info(token): Promise<UserTokenOutsideDto> {
        try {
            if (this.tokenService.verify(token)) {
                let tokenData: any = this.tokenService.decode(token);
                let user = await this.userModel.findOne({'_id': tokenData.id}).exec();
                if (user && this.tokenService.getSecretKey(tokenData) === this.tokenService.getSecretKey(user)) {
                    const userOutside = classToClass(plainToClass<UserDto, object>(UserDto, user.toObject(), {
                        excludePrefixes: ["_"]
                    }));

                    let res = new UserTokenOutsideDto();
                    res.user = userOutside;
                    res.token = await this.tokenService.createToken(user);

                    return res;
                } else {
                    throw await new Error();
                }
            } else {
                throw await new Error();
            }
        } catch (error) {
            throw error;
        }
    }

    async getToken(token: string): Promise<any>{
        try {

            return await this.tokenService.verify(token);
        } catch (e) {
            if ((<Error>e).name === 'TokenExpiredError') {
                let tokenData: any = this.tokenService.decode(token);
                let userOutside: UserOutsideDto = this.tokenService.decode(token);
                let findedUser = await this.userModel.findOne({_id: userOutside.id}).exec();
                if (findedUser && this.tokenService.getSecretKey(tokenData) === this.tokenService.getSecretKey(findedUser)) {
                    return await this.tokenService.createToken(findedUser);
                }else {
                    throw await new ReadError('Пользователь не найден', {name: 'User not found.'});
                }
            }else if ((<Error>e).name === 'JsonWebTokenError') {
                throw await new ReadError("Ошибка токена", e);
            }
            else {
                throw await new ReadError("Неизвестная ошибка", e);
            }
        }
    }

    async register(email: string, username: string, password: string): Promise<UserTokenOutsideDto> {
        try {
            let user = new User();
            user.email = email.toLowerCase();
            user.setPassword(password);
            user.displayName = username;
            user.isUser = true;
            user.isAdmin = false;
            user.isModerator = false;
            user.isActive = true;
            user.regData = new Date();
            user.lastLogin = new Date();

            const createUser = new this.userModel(user);
            let createdUser = await createUser.save();

            const userOutside = classToClass(plainToClass<UserDto, object>(UserDto, createdUser.toObject(), {
                excludePrefixes: ["_"]
            }));

            let res = new UserTokenOutsideDto();
            res.user = userOutside;
            res.token = await this.tokenService.createToken(createdUser);

            return res;
        } catch (error){
            throw error;
        }
    }

    async login(email: string, password: string): Promise<UserTokenOutsideDto> {
        email = email.toLowerCase();
        try {
            let findedUser = await this.userModel.findOne({email: email}).exec();

            if (findedUser) {
                let object = new User();
                object.password = findedUser.password;

                if(!object.verifyPassword(password)) {
                    throw new Error('Не верный email или пароль');
                }

                const userOutside = classToClass(plainToClass<UserDto, object>(UserDto, findedUser.toObject(), {
                    excludePrefixes: ["_"]
                }));

                let res = new UserTokenOutsideDto();
                res.user = userOutside;
                res.token = await this.tokenService.createToken(findedUser);

                return res;
            } else throw new Error('Не верный email или пароль');
        } catch (error) {
            throw error;
        }
    }

}

function ReadError(message, cause) {
    this.message = message;
    this.name = cause.name;
}