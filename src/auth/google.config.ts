import { registerAs } from '@nestjs/config';

export default registerAs('google-oauth-2', () => ({
  GOOGLE_OAUTH_2_CLIENT_ID: process.env.GOOGLE_OAUTH_2_CLIENT_ID,
  GOOGLE_OAUTH_2_CLIENT_SECRET: process.env.GOOGLE_OAUTH_2_CLIENT_SECRET,
  GOOGLE_OAUTH_2_CALLBACK_URL: process.env.GOOGLE_OAUTH_2_CALLBACK_URL,
  GOOGLE_OAUTH_2_SCOPES: process.env.GOOGLE_OAUTH_2_SCOPES,
}));
