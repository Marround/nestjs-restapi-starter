import {Module, NestModule, RequestMethod} from '@nestjs/common';
import {MiddlewaresConsumer} from "@nestjs/common/interfaces/middlewares";
import { services } from './services/index';
import { controllers } from './controllers/index';
import * as passport from 'passport';
import {DatabaseModule} from "./providers/database.module";
import {usersProviders} from "./users.provider";

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [
        ...controllers
    ],
    components: [
        ...services,
        ...usersProviders
    ],
})
export class AuthenticationModule implements NestModule {
    public configure(consumer: MiddlewaresConsumer) {
        consumer
            .apply(passport.authenticate('jwt', { session: false }))
            .forRoutes({ path: '/api/auth/authorized', method: RequestMethod.ALL });
    }
}