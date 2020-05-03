import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto, CreatedUserDto } from './dto/user.dto';
import { User } from './interface/user.interface';
import { ApiOkResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiCreatedResponse({
    type: CreatedUserDto,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
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
    return this.userService.findOne({ _id: new Types.ObjectId(userId) });
  }
}
