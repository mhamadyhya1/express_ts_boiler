import Joi from 'joi';
import 'dotenv/config';

const envVarsSchema = Joi.object()
  .keys({
    ACCESS: Joi.string().required(),
    REFRESH: Joi.string().required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    RESET_PASSWORD_TOKEN: Joi.string().required().description('Reset Password secret key'),
    RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10).description('minutes after which reset tokens expire'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: {
      ACCESS: envVars.ACCESS,
      REFRESH: envVars.ACCESS,
    },
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    cookieOptions: {
      httpOnly: true,
      secure: envVars.NODE_ENV === 'production',
      signed: true,
    },
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  resetPassword: {
    resetTokenExpTime: envVars.RESET_PASSWORD_EXPIRATION_MINUTES,
    resetPasswordSec: envVars.RESET_PASSWORD_TOKEN,
  },
  clientUrl: envVars.CLIENT_URL,
};

export default config;
