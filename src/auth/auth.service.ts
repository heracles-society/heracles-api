import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';

interface AuthProfile {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  locale: string;
  name: string;
  picture: string;
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async validateUser(rawProfile: any): Promise<any> {
    const authProfile: AuthProfile = rawProfile._json;
    const email = authProfile.email;
    const user = await this.usersService.findOne({
      email: email,
    });

    if (user === null) {
      const {
        email,
        family_name: familyName,
        given_name: givenName,
        name,
        picture,
        sub: openId,
      } = authProfile;
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
}
