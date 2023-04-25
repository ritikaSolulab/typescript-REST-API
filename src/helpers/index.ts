import crypto from 'crypto';
import { logger } from "../utils/log";
const SECRET = 'SECRET-API';

export const authentication = (salt: string, password: string): string => {
  logger.info("Inside authentication");
  return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}

export const random = () => crypto.randomBytes(128).toString('base64');
