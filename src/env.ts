export const getPort = () => process.env.PORT || 80;

export const getDbHost = (): string => process.env.DB_HOST || 'localhost';
export const getDbPort = (): number => +process.env.DB_PORT || 5432;
export const getDbSchema = (): string => process.env.DB_SCHEMA || 'public';
export const getDbUser = (): string => process.env.DB_USER || 'todo';
export const getDbPassword = (): string => process.env.DB_PASSWORD || 'todo';
export const getDbName = (): string => process.env.DB_NAME || 'todo';
export const getDbSync = (): boolean => !!process.env.DB_SYNC || true;
export const getJwtSecret = (): string => process.env.JWT_SECRET || 'secret';
