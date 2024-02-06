import dotenv from 'dotenv'
dotenv.config();

export const config = {
    port: process.env.PORT,
    redis: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      db: process.env.REDIS_DB,
    },
};