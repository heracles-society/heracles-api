import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto, CreatedUserDto } from './dto/user.dto';
import { User } from './interface/user.interface';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiBearerAuth,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiExcludeEndpoint()
  @Post()
  @ApiCreatedResponse({
    type: CreatedUserDto,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const userRecord = this.userService.create(createUserDto);
    if (userRecord) {
      return userRecord;
    }
    throw new BadRequestException();
  }

  @Get()
  @ApiOkResponse({
    type: [CreatedUserDto],
  })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: CreatedUserDto,
  })
  async findById(@Param('id') userId: string): Promise<User> {
    const userRecord = this.userService.findOne({
      _id: new Types.ObjectId(userId),
    });
    if (userRecord) {
      return userRecord;
    }
    throw new NotFoundException();
  }
}
