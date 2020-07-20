import {
  Controller,
  Get,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { baseControllerFactory } from '../utils/base-module/base.controller';
import { CreateUserDto, CreatedUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.model';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { USER_MODEL } from './constants';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Request } from 'express';
import { ApplicationService } from '../society/application/application.service';

const BaseUserController = baseControllerFactory<User>({
  modelName: USER_MODEL,
  entity: User,
  createEntitySchema: CreateUserDto,
  createdEntitySchema: CreatedUserDto,
  patchEntitySchema: UpdateUserDto,
});

@ApiTags('users')
@Controller('users')
export class UserController extends BaseUserController {
  constructor(
    userService: UserService,
    private readonly applicationService: ApplicationService,
  ) {
    super(userService);
  }

  @Get('me')
  @ApiOkResponse({
    description: 'Entity record found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Permission required to perform operation.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ operationId: 'User__get_my_details' })
  async getUserDetails(@Req() req: Request) {
    const user = req.user as any;
    const userRecord: User = await this.baseService.findById(user.id);
    if (userRecord) {
      const application = await this.applicationService.findOne({
        $and: [
          {
            raisedBy: userRecord.id,
          },
        ],
      });

      let hasOnboarded = false;
      if (application) {
        hasOnboarded = true;
      }

      return {
        email: userRecord.email,
        givenName: userRecord.givenName,
        familyName: userRecord.familyName,
        id: userRecord.id,
        picture: userRecord.picture,
        mobile: userRecord.mobile,
        hasOnboarded,
      };
    }

    throw new NotFoundException();
  }
}
