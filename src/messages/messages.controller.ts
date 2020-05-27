import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
  NotFoundException,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto, CreatedMessageDto } from './dto/message.dto';
import { Message } from './interface/message.interface';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UtilService } from '../utils/utils.service';
import { PaginatedAPIParams } from '../utils/pagination.decorators';
import { UserService } from '../users/users.service';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private utilService: UtilService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreatedMessageDto,
  })
  async create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    const society = await this.messageService.create(createMessageDto);
    if (society === null) {
      throw new BadRequestException();
    }
    return society;
  }

  @Get()
  @ApiOkResponse({
    type: [CreatedMessageDto],
  })
  @ApiQuery({
    name: 'q',
    description: 'Query filter',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'from',
    description: 'UserId or Email',
    required: false,
    type: String,
  })
  @PaginatedAPIParams
  async findAll(@Query() query: any, @Req() req): Promise<Message[]> {
    const userIdentifier: string = query.from;
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
    } else {
      if (userIdentifier) {
        const parsedUserQuery = await this.utilService.parseQueryParam(
          `(email=${userIdentifier}|_id=${userIdentifier})`,
        );
        const fromUserDBQuery = await this.utilService.parseDBParam(
          parsedUserQuery,
        );

        const user = await this.userService.findOne(fromUserDBQuery);
        if (!user) {
          throw new NotFoundException();
        }
      }
    }
    const {
      total,
      data,
      cursor: newCursor,
    } = await this.messageService.findAll(params, { skip, limit, cursor });
    req.res.set('HERACLES-API-Total-Count', total);
    req.res.set('HERACLES-API-Cursor', newCursor);
    return data;
  }
}
