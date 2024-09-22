import * as crypto from 'crypto';

const SECRET = 'SPEED-REST-API';
const SIZE: number = 128;

export const random = () => crypto.randomBytes(SIZE).toString('base64');
export const authentication = (salt: String, password: String) => {
  return crypto
    .createHmac('sha256', [salt, password].join('/'))
    .update(SECRET)
    .digest('hex');
};
