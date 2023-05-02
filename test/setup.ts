export default async (): Promise<void> => {
  process.env.JWT_SECRET = 'testSecret';
  process.env.DB_HOST = 'testdb';
};
