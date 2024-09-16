import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { dbConfig } from './database';

config();

export default new DataSource(dbConfig());
