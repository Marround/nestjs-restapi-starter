import { Component } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {UserDto} from "../dto/user.dto";

@Component()
export class TokenService {
    async createToken(user: UserDto) {
        let userToSign = {
            id: user.id,
            email: user.email,
            isUser: user.isUser,
            isAdmin: user.isAdmin,
            isModerator: user.isModerator
        };
        const expiresIn = process.env.JWT_EXPIRATION_DELTA, secretOrKey = this.getSecretKey(userToSign);
        const token = jwt.sign(userToSign, secretOrKey, { expiresIn });

        return {
            expires_in: expiresIn,
            token: token,
        };
    }
    verify(token: string) {
        const data: any = jwt.decode(
            token
        );
        return jwt.verify(token, this.getSecretKey(data));
    }

    decode(token: string) {
        return jwt.decode(
            token
        )
    }
    getSecretKey(data: any) {
        return process.env.SECRET_KEY + (
            data? (
                '$' + data.id +
                '$' + data.email +
                '$' + data.isUser +
                '$' + data.isAdmin +
                '$' + data.isModerator
            ) : ''
        )
    }
}