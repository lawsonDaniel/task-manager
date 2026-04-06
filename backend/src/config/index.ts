import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  dbUrl: string;
  jwtSecret: string;
  nodeEnv: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  dbUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;