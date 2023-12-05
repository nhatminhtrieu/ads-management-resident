import { config } from 'dotenv';
config();

export const PORT = process.env.PORT;
export const CONNECTION_STRING = process.env.CONNECTION_STRING;
export const JWT_SECRET = process.env.JWT_SECRET;