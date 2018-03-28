import { CanActivate, ExecutionContext, Guard } from '@nestjs/common';
import {Reflector} from "@nestjs/core";
import {TokenService} from "../services/token.service";
import {IncomingMessage} from "http";
import {plainToClass} from "class-transformer";
import {User} from "../classes/user";

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

        if (
            roles && roles.length > 0 &&
            authorizationHeader &&
            authorizationHeader.indexOf(process.env.JWT_AUTH_HEADER_PREFIX) === 0
        ) {
            let token =
                process.env.JWT_AUTH_HEADER_PREFIX ?
                    authorizationHeader.split(process.env.JWT_AUTH_HEADER_PREFIX)[1] :
                    authorizationHeader;
            token = token.trim();

            // console.log(this.tokenService.verify(token));

            if (token && this.tokenService.verify(token)) {
                const data: any = this.tokenService.decode(token);
                req['user'] = plainToClass(User, data);
            }
        }
        const hasRole = roles ? roles.filter(roleName =>
            req['user'] &&
            req['user'][roleName]
        ).length > 0 : null;

        console.log(req['user']);

        return hasRole === true;
    }
}