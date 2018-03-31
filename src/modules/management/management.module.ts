import {Module, NestModule} from '@nestjs/common';
import { controllers } from './controllers/index';
import { services } from './services/index';
import {AuthenticationModule} from "../authentication/authentication.module";
import {managementProviders} from "./management.provider";
import {DatabaseModule} from "../providers/database.module";

@Module({
    imports: [
        AuthenticationModule,
        DatabaseModule
    ],
    exports: [
        ...services,
        ...managementProviders
    ],
    controllers: [
        ...controllers
    ],
    components: [
        ...services,
        ...managementProviders
    ]
})
export class ManagementModule implements NestModule {
    public configure() {}
}