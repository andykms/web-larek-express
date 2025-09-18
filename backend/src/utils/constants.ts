import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export const IMAGES_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg+xml'];

export const MAX_FILE_TIME_IN_MS = 5 * 60 * 1000;

export const MAX_IMAGE_SIZE_IN_BYTES = 10 * 1024 * 1024;

export const FILES_TIMEOUTS: Map<string, number> = new Map();

const {
  PORT,
  DB_ADDRESS,
  IMAGE_PATH,
  AUTH_ACCESS_TOKEN_SECRET,
  AUTH_REFRESH_TOKEN_SECRET,
  AUTH_REFRESH_TOKEN_EXPIRY,
  AUTH_ACCESS_TOKEN_EXPIRY,
} = process.env;

if (!PORT) {
  throw new Error('порт не указан в .env');
}

if (!DB_ADDRESS) {
  throw new Error('url базы данных не указан в .env');
}

if (!IMAGE_PATH) {
  throw new Error('директория для изображений не указана в .env');
}

if (!AUTH_ACCESS_TOKEN_SECRET) {
  throw new Error('секретный ключ для access token не указан в .env');
}

if (!AUTH_REFRESH_TOKEN_SECRET) {
  throw new Error('секретный ключ для refresh token не указан в .env');
}

if (!AUTH_ACCESS_TOKEN_EXPIRY) {
  throw new Error('время жизни access token не указано в .env');
}

if (!AUTH_REFRESH_TOKEN_EXPIRY) {
  throw new Error('время жизни refresh token не указано в .env');
}

export {
  PORT,
  DB_ADDRESS,
  IMAGE_PATH,
  AUTH_ACCESS_TOKEN_SECRET,
  AUTH_REFRESH_TOKEN_SECRET,
  AUTH_ACCESS_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_EXPIRY,
};
