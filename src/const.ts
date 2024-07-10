import dotenv from 'dotenv';
dotenv.config();

export const IS_DEV = process.env.NODE_ENV === 'development';

export const E2E_ENDPOINT= process.env.E2E_ENDPOINT || 'http://localhost:3000';