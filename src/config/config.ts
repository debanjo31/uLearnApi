interface Config {
  port: number;
  nodeEnv: string;
  mongoUri: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ulearn',
};

export default config;
