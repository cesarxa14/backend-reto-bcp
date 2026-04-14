import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'chelseafc11',
    database: process.env.DB_NAME || 'cards-db',
    autoLoadEntities: true,
    synchronize: true,
});