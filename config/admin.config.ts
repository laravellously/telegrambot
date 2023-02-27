import { registerAs } from '@nestjs/config';

export default registerAs('admin', () => ({
  path: process.env.ADMIN_PATH || 'admin',
  email: process.env.ADMIN_EMAIL || 'admin@mailer.lite',
}));
