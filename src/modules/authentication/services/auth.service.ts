import { Component, Inject } from '@nestjs/common';
import {User} from "../classes/user";
import { Model } from 'mongoose';
import { TokenService } from './token.service';
import {IUser} from "../interfaces/user.interface";
import {UserDto, UserOutsideDto, UserTokenOutsideDto} from "../dto/user.dto";

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
                    let userOutside = new UserOutsideDto();
                    userOutside.id = user.id;
                    userOutside.email = user.email;
                    userOutside.displayName = user.displayName;
                    userOutside.isUser = user.isUser;
                    userOutside.isAdmin = user.isAdmin;
                    userOutside.isModerator = user.isModerator;
                    userOutside.isActive = user.isActive;

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

    async register(email: string, username: string, password: string): Promise<UserTokenOutsideDto> {
        try {
            // let user = new User(email, password, username, true, false, false, true, new Date(), new Date());
            let user = new User();
            user.email = email;
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

            let userOutside = new UserOutsideDto();
            userOutside.id = createdUser.id;
            userOutside.email = createdUser.email;
            userOutside.displayName = createdUser.displayName;
            userOutside.isUser = createdUser.isUser;
            userOutside.isAdmin = createdUser.isAdmin;
            userOutside.isModerator = createdUser.isModerator;
            userOutside.isActive = createdUser.isActive;

            let res = new UserTokenOutsideDto();
            res.user = userOutside;
            res.token = await this.tokenService.createToken(createdUser);

            return res;
        } catch (error){
            throw error;
        }
    }

    async login(email: string, password: string): Promise<UserTokenOutsideDto> {
        try {
            let findedUser = await this.userModel.findOne({email: email}).exec();

            if (findedUser) {
                let object = new User();
                object.password = findedUser.password;

                if(!object.verifyPassword(password)) {
                    throw new Error('Не верный email или пароль');
                }

                let userOutside = new UserOutsideDto();
                userOutside.id = findedUser.id;
                userOutside.email = findedUser.email;
                userOutside.displayName = findedUser.displayName;
                userOutside.isUser = findedUser.isUser;
                userOutside.isAdmin = findedUser.isAdmin;
                userOutside.isModerator = findedUser.isModerator;
                userOutside.isActive = findedUser.isActive;

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