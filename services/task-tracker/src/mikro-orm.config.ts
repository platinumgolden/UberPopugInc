import { join } from 'node:path';
import { Logger } from '@nestjs/common';
import { Options } from '@prizma/core';
import { Task, User } from './entities';

const logger = new Logger('MikroORM');
const DATABASE_URI = process.env.DATABASE_URI;

const options: Options = {
  entities: [Task, User],
  clientUrl: DATABASE_URI,
  type: 'postgresql',
  debug: true,
  logger: logger.log.bind(logger),
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: join(__dirname, 'src', 'migration'),
    pattern: /^[\w-]+\d+\.ts$/,
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true, // wrap all migrations in master transaction
    emit: 'ts', // migration generation mode
  },
};

export default options;
