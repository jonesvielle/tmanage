import { config } from 'dotenv';
import { Logger } from '@nestjs/common';
import migrations from '../database/migrations/index';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

config({ path: '.env' });

export const dbConfig = (): PostgresConnectionOptions => {
  return {
    type: 'postgres',
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT, 10) || 5432,
    url: process.env.DATABASE_URL,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    ssl: false,

    // We are using migrations, synchronize should be set to false.
    synchronize: false,
    dropSchema: false,

    // Run migrations automatically,
    // you can disable this if you prefer running migration manually.
    migrationsRun: false,
    logging: true,
    migrations: migrations,
  };
};

if (process.env.NODE_ENV === 'development') {
  Logger.debug(dbConfig());
}
