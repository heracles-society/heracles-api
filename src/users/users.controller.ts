import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
  NotFoundException,
  UseGuards,
  Query,
  Req,
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
  ApiQuery,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UtilService } from '../utils/utils.service';
import { PaginatedAPIParams } from '../utils/pagination.decorators';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private userService: UserService,
    private utilService: UtilService,
  ) {}

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
  @ApiQuery({
    name: 'q',
    description: 'Query filter',
    required: false,
    type: String,
  })
  @PaginatedAPIParams
  async findAll(@Query() query: any, @Req() req): Promise<User[]> {
    const queryString: string = query.q;
    const { skip, limit, cursor } = query;
    let params = {};
    if (queryString) {
      const parsedQueryString = await this.utilService.parseQueryParam(
        queryString,
      );
      const finalDBQuery = await this.utilService.parseDBParam(
        parsedQueryString,
      );
      params = finalDBQuery;
    }

    const {
      total,
      data,
      cursor: newCursor,
    } = await this.userService.findAll(params, { skip, limit, cursor });
    req.res.set('HERACLES-API-Total-Count', total);
    req.res.set('HERACLES-API-Cursor', newCursor);
    return data;
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
