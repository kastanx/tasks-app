import { Connection, ConnectionOptions, createConnection as typeOrmCreateConnection } from 'typeorm';
import { getDbHost, getDbPort, getDbSchema, getDbUser, getDbPassword, getDbName, getDbSync } from '../env';
import { Task } from '../task/model/Task';
import { User } from '../user/model/User';

export const getConnectionOptions = (): ConnectionOptions => ({
  type: 'postgres',
  host: getDbHost(),
  port: getDbPort(),
  schema: getDbSchema(),
  username: getDbUser(),
  password: getDbPassword(),
  database: getDbName(),
  entities: [Task, User],
  synchronize: getDbSync(),
});

export const createConnection = (): Promise<Connection> => typeOrmCreateConnection(getConnectionOptions());
