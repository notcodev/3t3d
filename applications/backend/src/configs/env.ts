import { cleanEnv, host, port, str, url } from 'envalid'

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  POSTGRES_URL: url(),
  REDIS_URL: url(),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  COOKIES_SECRET: str(),
  WEB_SERVER_HOST: host({ default: '0.0.0.0', devDefault: 'localhost' }),
  WEB_SERVER_PORT: port({ default: 3000 }),
})
