import { Injectable, HttpService } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { User } from '../users/interface/user.interface';

export interface AuthProfile {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  locale: string;
  name: string;
  picture: string;
  sub: string;
}

export interface AuthJwtToken {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async verifyAccessToken(accessToken: string): Promise<boolean> {
    const isTokenValid = await this.httpService
      .get(
        `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`,
      )
      .toPromise()
      .then(() => true)
      .catch(() => false);

    return isTokenValid;
  }

  async getProfileUsingValidAccessToken(
    accessToken: string,
  ): Promise<AuthProfile> {
    const response = await this.httpService
      .get(
        `https://openidconnect.googleapis.com/v1/userinfo?access_token=${accessToken}`,
      )
      .toPromise();
    const profile: AuthProfile = response.data;
    return profile;
  }

  async findOrCreateUserFromAccessToken(accessToken: string): Promise<User> {
    const isTokenValid = await this.verifyAccessToken(accessToken);
    if (isTokenValid) {
      const authProfile = await this.getProfileUsingValidAccessToken(
        accessToken,
      );
      if (authProfile) {
        return this.findOrCreateUserFromAuthProfile(authProfile);
      }
    }
    return null;
  }

  async findOrCreateUserFromAuthProfile(
    authProfile: AuthProfile,
  ): Promise<any> {
    const {
      email,
      family_name: familyName,
      given_name: givenName,
      name,
      picture,
      sub: openId,
    } = authProfile;

    const user = await this.usersService.findOne({
      openId: openId,
    });

    if (user === null) {
      const user = await this.usersService.create({
        email,
        name,
        familyName,
        givenName,
        picture,
        openId,
        roles: [],
      });
      return user;
    }

    return user;
  }

  async generateToken(
    user: User,
    signOptions: jwt.SignOptions = {},
  ): Promise<AuthJwtToken> {
    const payload = { sub: user.id, email: user.email, scopes: user.roles };
    return {
      accessToken: this.jwtService.sign(payload, signOptions),
    };
  }
}
