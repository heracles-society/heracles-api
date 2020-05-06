import { Strategy, StrategyOptionsWithRequest } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigType } from '@nestjs/config';
import googleConfig from './google.config';

@Injectable()
export class GoogleOauth2Strategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleConfig.KEY)
    private googleOauthConfig: ConfigType<typeof googleConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleOauthConfig.GOOGLE_OAUTH_2_CLIENT_ID,
      clientSecret: googleOauthConfig.GOOGLE_OAUTH_2_CLIENT_SECRET,
      callbackURL: googleOauthConfig.GOOGLE_OAUTH_2_CALLBACK_URL,
      scope: googleOauthConfig.GOOGLE_OAUTH_2_SCOPES.split(
        ',',
      ).map((e: string) => e.trim()),
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(
    req, // express request object
    access, // access token from Google
    refresh, // refresh token from Google
    profile, // user profile, parsed by passport
  ): Promise<any> {
    return this.authService.validateUser(profile);
  }
}
