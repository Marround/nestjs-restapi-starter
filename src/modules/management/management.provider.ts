import { Connection } from 'mongoose';
import { schemas } from './schemas/index';

export const managementProviders = [
    {
        provide: 'FileModelToken',
        useFactory: (connection: Connection) => connection.model('Files', schemas[0].schema),
        inject: ['DbConnectionToken'],
    }
];