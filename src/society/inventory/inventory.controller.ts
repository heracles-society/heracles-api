import {
  Controller,
  UseGuards,
  SetMetadata,
  Post,
  Body,
  BadRequestException,
  Get,
  Param,
  NotFoundException,
  Put,
  Patch,
  Delete,
  HttpStatus,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateInventoryDto,
  CreatedInventoryDto,
  UpdateInventoryDto,
} from './inventory.dto';
import {
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { SocietyNamespaceGuard } from '../society.namespace.guard';
import { INVENTORY_MODEL } from './constants';
import { PaginatedAPIParams } from '../../utils/pagination.decorators';
import { IQueryOptions } from '../../utils/base-module/base.interface';
import { parseQueryParamFilters } from '../../utils/helpers/api.helpers';
import { parseQueryParamFilterToDBQuery } from '../../utils/helpers/db.helpers';
import { Request } from 'express';
import { RoleBindingService } from '../../role-binding/role-binding.service';
import { User } from '../../user/user.model';
import { RoleService } from '../../role/role.service';
import { RoleKind } from '../../role/role.dto';
import {
  RoleBindingKind,
  SubjectKind,
} from '../../role-binding/role-binding.dto';

@ApiTags('inventories')
@Controller('societies/:societyId/inventories')
@SetMetadata('ResourceKind', INVENTORY_MODEL)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, SocietyNamespaceGuard)
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly roleService: RoleService,
    private readonly roleBindingService: RoleBindingService,
  ) {}
  @Get()
  @ApiOkResponse({
    type: [CreatedInventoryDto],
  })
  @ApiParam({
    name: 'societyId',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'q',
    description: 'Query filter',
    required: false,
    type: String,
  })
  @PaginatedAPIParams
  @ApiUnauthorizedResponse({
    description: 'Permission required to perform operation.',
  })
  @SetMetadata('action', 'GET')
  @ApiOperation({ operationId: `${INVENTORY_MODEL}__find` })
  public async find(
    @Param('societyId') societyId: string,
    @Query() query: any,
    @Req() req: Request,
  ) {
    const queryString: string = query.q;
    const { skip = 0, limit = 10, cursor = null } = query;
    let params: IQueryOptions = { $and: [] };

    if (queryString) {
      const parsedQueryString = parseQueryParamFilters(queryString);
      const finalDBQuery = parseQueryParamFilterToDBQuery(parsedQueryString);
      params = finalDBQuery;
    }

    params['$and'].unshift({
      society: societyId,
    });

    const user = req.user as User;

    const {
      all,
      resourceIds,
    } = await this.roleBindingService.getPermittedResources({
      action: 'GET',
      namespace: societyId,
      resourceKind: INVENTORY_MODEL,
      subjectId: user.id,
    });

    if (all === false && resourceIds.length === 0) {
      throw new UnauthorizedException();
    }

    if (all === false) {
      params['$and'].unshift({
        _id: { $in: resourceIds },
      });
    }

    const {
      total,
      data,
      cursor: newCursor,
    } = await this.inventoryService.find(params, { skip, limit, cursor });
    req.res.set('HERACLES-API-Total-Count', total.toString());
    req.res.set('HERACLES-API-Cursor', newCursor ? newCursor.toString() : null);
    return data;
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The entity record has been successfully created.',
    type: CreatedInventoryDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Permission required to perform operation.',
  })
  @ApiBody({
    required: true,
    type: CreateInventoryDto,
    description: 'Data for entity creation',
    isArray: false,
  })
  @ApiParam({
    name: 'societyId',
    required: true,
    type: String,
  })
  @SetMetadata('action', 'CREATE')
  @ApiOperation({ operationId: `${INVENTORY_MODEL}__create` })
  async create(
    @Req() req: Request,
    @Param('societyId') societyId: string,
    @Body() entity: CreateInventoryDto,
  ) {
    const createdEntity = await this.inventoryService.create({
      ...entity,
      society: societyId,
    });
    if (createdEntity) {
      try {
        const user = req.user as User;
        const role = await this.roleService.create({
          name: `${createdEntity.id}__ROLE`,
          kind: RoleKind.GLOBAL,
          rules: [
            {
              resourceKind: INVENTORY_MODEL,
              resources: [createdEntity.id],
              actions: ['GET'],
            },
          ],
        });
        await this.roleBindingService.create({
          name: `${createdEntity.id}__ROLE_BINDING`,
          kind: RoleBindingKind.NAMESPACED,
          namespace: societyId,
          roles: [{ id: role.id }],
          subjects: [{ kind: SubjectKind.USER, id: user.id }],
        });
      } catch (error) {
        // Add logging statement here
      }
      return createdEntity;
    }
    throw new BadRequestException();
  }

  @Get(':id')
  @ApiOkResponse({
    type: CreatedInventoryDto,
    description: 'Entity record found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Permission required to perform operation.',
  })
  @ApiParam({
    name: 'societyId',
    required: true,
    type: String,
  })
  @SetMetadata('action', 'GET')
  @ApiOperation({ operationId: `${INVENTORY_MODEL}__find_one` })
  async findById(
    @Req() req: Request,
    @Param('societyId') societyId: string,
    @Param('id') inventoryId: string,
  ) {
    const params: IQueryOptions = {
      $and: [
        {
          _id: inventoryId,
          society: societyId,
        },
      ],
    };

    const user = req.user as User;

    const {
      all,
      resourceIds,
    } = await this.roleBindingService.getPermittedResources({
      action: 'GET',
      namespace: societyId,
      resourceKind: INVENTORY_MODEL,
      subjectId: user.id,
    });

    if (all === false && resourceIds.length === 0) {
      throw new UnauthorizedException();
    }

    if (all === false) {
      params['$and'].unshift({
        _id: { $in: resourceIds },
      });
    }

    const record = await this.inventoryService.findOne(params);

    if (record) {
      return record;
    }
    throw new NotFoundException();
  }

  @Put(':id')
  @ApiOkResponse({
    type: CreatedInventoryDto,
    description: 'Entity record updated successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Permission required to perform operation.',
  })
  @ApiNotFoundResponse({
    description: 'Entity record not found.',
  })
  @ApiBody({
    required: true,
    type: CreateInventoryDto,
    description: 'Data for updating entity',
    isArray: false,
  })
  @ApiParam({
    name: 'societyId',
    required: true,
    type: String,
  })
  @SetMetadata('action', 'PUT')
  @ApiOperation({ operationId: `${INVENTORY_MODEL}__update_one` })
  async updateById(
    @Req() req: Request,
    @Param('societyId') societyId: string,
    @Param('id') inventoryId: string,
    @Body() body: CreateInventoryDto,
  ) {
    const params: IQueryOptions = {
      $and: [
        {
          _id: inventoryId,
          society: societyId,
        },
      ],
    };

    const user = req.user as User;

    const {
      all,
      resourceIds,
    } = await this.roleBindingService.getPermittedResources({
      action: 'PUT',
      namespace: societyId,
      resourceKind: INVENTORY_MODEL,
      subjectId: user.id,
    });

    if (all === false && resourceIds.length === 0) {
      throw new UnauthorizedException();
    }

    if (all === false) {
      params['$and'].unshift({
        _id: { $in: resourceIds },
      });
    }

    const record = await this.inventoryService.findOne(params);

    if (record) {
      const updatedEntity = await this.inventoryService.update(
        inventoryId,
        body,
      );
      if (updatedEntity) {
        return updatedEntity;
      }
    }

    throw new NotFoundException();
  }

  @Patch(':id')
  @ApiOkResponse({
    type: CreatedInventoryDto,
    description: 'Patched entity succesfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Permission required to perform operation.',
  })
  @ApiNotFoundResponse({
    description: 'Entity record not found.',
  })
  @ApiBody({
    type: UpdateInventoryDto,
  })
  @ApiParam({
    name: 'societyId',
    required: true,
    type: String,
  })
  @SetMetadata('action', 'PATCH')
  @ApiOperation({ operationId: `${INVENTORY_MODEL}__patch_one` })
  async patchById(
    @Req() req: Request,
    @Param('societyId') societyId: string,
    @Param('id') inventoryId: string,
    @Body() body: UpdateInventoryDto,
  ) {
    const params: IQueryOptions = {
      $and: [
        {
          _id: inventoryId,
          society: societyId,
        },
      ],
    };

    const user = req.user as User;

    const {
      all,
      resourceIds,
    } = await this.roleBindingService.getPermittedResources({
      action: 'PATCH',
      namespace: societyId,
      resourceKind: INVENTORY_MODEL,
      subjectId: user.id,
    });

    if (all === false && resourceIds.length === 0) {
      throw new UnauthorizedException();
    }

    if (all === false) {
      params['$and'].unshift({
        _id: { $in: resourceIds },
      });
    }

    const record = await this.inventoryService.findOne(params);

    if (record) {
      const updatedEntity = await this.inventoryService.patch(
        inventoryId,
        body,
      );
      if (updatedEntity) {
        return updatedEntity;
      }
    }

    throw new NotFoundException();
  }

  @Delete(':id')
  @ApiOkResponse({
    type: null,
    status: HttpStatus.NO_CONTENT,
    description: 'Entity deleted successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Permission required to perform operation.',
  })
  @ApiNotFoundResponse({
    description: 'Entity record not found.',
  })
  @ApiParam({
    name: 'societyId',
    required: true,
    type: String,
  })
  @SetMetadata('action', 'DELETE')
  @ApiOperation({ operationId: `${INVENTORY_MODEL}_Delete_One` })
  async deleteById(
    @Req() req: Request,
    @Param('societyId') societyId: string,
    @Param('id') inventoryId: string,
  ) {
    const params: IQueryOptions = {
      $and: [
        {
          _id: inventoryId,
          society: societyId,
        },
      ],
    };

    const user = req.user as User;

    const {
      all,
      resourceIds,
    } = await this.roleBindingService.getPermittedResources({
      action: 'PUT',
      namespace: societyId,
      resourceKind: INVENTORY_MODEL,
      subjectId: user.id,
    });

    if (all === false && resourceIds.length === 0) {
      throw new UnauthorizedException();
    }

    if (all === false) {
      params['$and'].unshift({
        _id: { $in: resourceIds },
      });
    }

    const record = await this.inventoryService.findOne(params);

    if (record) {
      const updatedEntity = await this.inventoryService.delete(inventoryId);
      if (updatedEntity) {
        return null;
      }
    }

    throw new NotFoundException();
  }
}
