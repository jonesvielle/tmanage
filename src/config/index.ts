import { config } from 'dotenv';
import { dbConfig } from './database';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

config();

interface iConfig {
  baseUrl: string;
  database: PostgresConnectionOptions;
  env: string;
  keys: {
    privateKey: string;
    publicKey: string;
  };
  port: number;
}

export default (): Partial<iConfig> => ({
  baseUrl: process.env.APP_BASE_URL || 'http://localhost',
  database: dbConfig(),
  env: process.env.NODE_ENV || 'development',
  keys: {
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
    publicKey: process.env.PUBLIC_KEY.replace(/\\n/gm, '\n'),
  },
  port: parseInt(process.env.PORT, 10) || 3080,
});
