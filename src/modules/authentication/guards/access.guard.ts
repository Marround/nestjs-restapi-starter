import { CanActivate, ExecutionContext, Guard } from '@nestjs/common';
import {Reflector} from "@nestjs/core";
import {TokenService} from "../services/token.service";
import {IncomingMessage} from "http";
import {plainToClass} from "class-transformer";
import {UserDto} from "../dto/user.dto";

@Guard()
export class AccessGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly tokenService: TokenService,
    ) {}

    canActivate(req: IncomingMessage, context: ExecutionContext): boolean {
        const {parent, handler} = context;
        const authorizationHeader = req.headers['authorization'] ?
            String(req.headers['authorization']) : null;
        const roles = this.reflector.get<string[]>('roles', handler);

        if(roles && roles.length === 0) {
            return true;
        }

        if (
            roles && roles.length > 0 &&
            authorizationHeader
        ) {
            let token =
                process.env.JWT_AUTH_HEADER_PREFIX ?
                    authorizationHeader.split(' ')[1] :
                    authorizationHeader;
            token = String(token).trim();

            try {
                if (token && this.tokenService.verify(token)) {
                    const data: any = this.tokenService.decode(token);
                    req['user'] = plainToClass(UserDto, data);
                }
            }catch (err) {
                if((<Error>err).name === 'TokenExpiredError') {
                    return new ReadError("Время жизни токена истекло", err);
                } else if ((<Error>err).name === 'JsonWebTokenError') {
                    return new ReadError("Ошибка токена", err);
                }
                else {
                    throw err;
                }
            }
        }
        const hasRole = roles ? roles.filter(roleName =>
            req['user'] &&
            req['user'][roleName]
        ).length > 0 : null;


        return hasRole === true;
    }
}

function ReadError(message, cause) {
    this.message = message;
    this.name = cause.name;
}