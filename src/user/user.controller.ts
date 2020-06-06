import { Controller } from '@nestjs/common';
import { baseControllerFactory } from '../utils/base-module/base.controller';
import { CreateUserDto, CreatedUserDto } from './user.dto';
import { User } from './user.model';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

const BaseUserController = baseControllerFactory<User, CreateUserDto>({
  entity: CreateUserDto,
  createdEntity: CreatedUserDto,
});

@ApiTags('users')
@Controller('users')
export class UserController extends BaseUserController {
  constructor(userService: UserService) {
    super(userService);
  }
}
