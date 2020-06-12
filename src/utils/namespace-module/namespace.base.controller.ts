import {
  applyDecorators,
  UseGuards,
  UnauthorizedException,
  Get,
  SetMetadata,
  Param,
  Query,
  Req,
  Post,
  Body,
  BadRequestException,
  NotFoundException,
  Put,
  Patch,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiBody,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { PaginatedAPIParams } from '../pagination.decorators';
import { IQueryOptions } from '../base-module/base.interface';
import { parseQueryParamFilters } from '../helpers/api.helpers';
import { parseQueryParamFilterToDBQuery } from '../helpers/db.helpers';
import { Request } from 'express';
import { User } from '../../user/user.model';
import { RoleKind } from '../../role/role.dto';
import {
  RoleBindingKind,
  SubjectKind,
} from '../../role-binding/role-binding.dto';
import { BaseService } from '../base-module/base.service';
import { BaseModel } from '../base-module/base.model';
import { NamespaceGuard } from './namespace.guard';
import { RoleService } from '../../role/role.service';
import { RoleBindingService } from '../../role-binding/role-binding.service';

export function namespaceBaseControllerFactory<T extends BaseModel>(options: {
  namespaceParam;
  namespaceKey;
  modelName;
  createEntitySchema;
  createdEntitySchema;
  patchEntitySchema;
  routeDecorators?: Function;
}): any {
  const modelName = options.modelName;
  const namespaceKey = options.namespaceKey;
  const namespaceParam = options.namespaceParam;
  const CreateEntitySchema = options.createEntitySchema;
  const CreatedEntitySchema = options.createdEntitySchema;
  const PatchEntitySchema = options.patchEntitySchema;

  class CreateEntitySchemaKlass extends CreateEntitySchema {}
  class PatchEntitySchemaKlass extends PatchEntitySchema {}

  Object.defineProperty(CreateEntitySchemaKlass, 'name', {
    value: CreatedEntitySchema.name,
  });
  Object.defineProperty(PatchEntitySchemaKlass, 'name', {
    value: PatchEntitySchema.name,
  });

  const RouteDecorators = options.routeDecorators
    ? options.routeDecorators
    : () =>
        applyDecorators(
          ApiBearerAuth(),
          UseGuards(JwtAuthGuard, NamespaceGuard),
          ApiParam({
            name: namespaceParam,
            required: true,
            type: String,
          }),
        );

  class BaseSocietyNamespaceController {
    constructor(
      private readonly baseService: BaseService<T>,
      private readonly roleService: RoleService,
      private readonly roleBindingService: RoleBindingService,
    ) {}
    @Get()
    @ApiOkResponse({
      type: [CreatedEntitySchema],
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
    @RouteDecorators('GET')
    @ApiOperation({ operationId: `${modelName}__find` })
    public async find(
      @Param(namespaceParam) namespaceValue: string,
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
        [namespaceKey]: namespaceValue,
      });

      const user = req.user as User;

      const {
        all,
        resourceIds,
      } = await this.roleBindingService.getPermittedResources({
        action: 'GET',
        namespace: namespaceValue,
        resourceKind: modelName,
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
      } = await this.baseService.find(params, { skip, limit, cursor });
      req.res.set('HERACLES-API-Total-Count', total.toString());
      req.res.set(
        'HERACLES-API-Cursor',
        newCursor ? newCursor.toString() : null,
      );
      return data;
    }

    @Post()
    @ApiCreatedResponse({
      description: 'The entity record has been successfully created.',
      type: CreatedEntitySchema,
    })
    @ApiUnauthorizedResponse({
      description: 'Permission required to perform operation.',
    })
    @ApiBody({
      required: true,
      type: CreateEntitySchema,
      description: 'Data for entity creation',
      isArray: false,
    })
    @SetMetadata('action', 'CREATE')
    @RouteDecorators('CREATE')
    @ApiOperation({ operationId: `${modelName}__create` })
    async create(
      @Req() req: Request,
      @Param(namespaceParam) namespaceValue: string,
      @Body() entity: CreateEntitySchemaKlass,
    ) {
      const createdEntity = await this.baseService.create({
        ...entity,
        [namespaceKey]: namespaceValue,
      });
      if (createdEntity) {
        try {
          const user = req.user as User;
          const role = await this.roleService.create({
            name: `${createdEntity.id}__ROLE`,
            kind: RoleKind.GLOBAL,
            rules: [
              {
                resourceKind: modelName,
                resources: [createdEntity.id],
                actions: ['GET'],
              },
            ],
          });
          await this.roleBindingService.create({
            name: `${createdEntity.id}__ROLE_BINDING`,
            kind: RoleBindingKind.NAMESPACED,
            namespace: namespaceValue,
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
      type: CreatedEntitySchema,
      description: 'Entity record found.',
    })
    @ApiUnauthorizedResponse({
      description: 'Permission required to perform operation.',
    })
    @ApiNotFoundResponse({
      description: 'Entity record not found.',
    })
    @SetMetadata('action', 'GET')
    @RouteDecorators('GET')
    @ApiOperation({ operationId: `${modelName}__find_one` })
    async findById(
      @Req() req: Request,
      @Param(namespaceParam) namespaceValue: string,
      @Param('id') inventoryId: string,
    ) {
      const params: IQueryOptions = {
        $and: [
          {
            _id: inventoryId,
            [namespaceKey]: namespaceValue,
          },
        ],
      };

      const user = req.user as User;

      const {
        all,
        resourceIds,
      } = await this.roleBindingService.getPermittedResources({
        action: 'GET',
        namespace: namespaceValue,
        resourceKind: modelName,
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

      const record = await this.baseService.findOne(params);

      if (record) {
        return record;
      }
      throw new NotFoundException();
    }

    @Put(':id')
    @ApiOkResponse({
      type: CreatedEntitySchema,
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
      type: CreateEntitySchema,
      description: 'Data for updating entity',
      isArray: false,
    })
    @SetMetadata('action', 'PUT')
    @RouteDecorators('PUT')
    @ApiOperation({ operationId: `${modelName}__update_one` })
    async updateById(
      @Req() req: Request,
      @Param(namespaceParam) namespaceValue: string,
      @Param('id') inventoryId: string,
      @Body() body: CreateEntitySchemaKlass,
    ) {
      const params: IQueryOptions = {
        $and: [
          {
            _id: inventoryId,
            [namespaceKey]: namespaceValue,
          },
        ],
      };

      const user = req.user as User;

      const {
        all,
        resourceIds,
      } = await this.roleBindingService.getPermittedResources({
        action: 'PUT',
        namespace: namespaceValue,
        resourceKind: modelName,
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

      const record = await this.baseService.findOne(params);

      if (record) {
        const updatedEntity = await this.baseService.update(inventoryId, body);
        if (updatedEntity) {
          return updatedEntity;
        }
      }

      throw new NotFoundException();
    }

    @Patch(':id')
    @ApiOkResponse({
      type: CreatedEntitySchema,
      description: 'Patched entity succesfully.',
    })
    @ApiUnauthorizedResponse({
      description: 'Permission required to perform operation.',
    })
    @ApiNotFoundResponse({
      description: 'Entity record not found.',
    })
    @ApiBody({
      type: PatchEntitySchema,
    })
    @SetMetadata('action', 'PATCH')
    @RouteDecorators('PATCH')
    @ApiOperation({ operationId: `${modelName}__patch_one` })
    async patchById(
      @Req() req: Request,
      @Param(namespaceParam) namespaceValue: string,
      @Param('id') inventoryId: string,
      @Body() body: PatchEntitySchemaKlass,
    ) {
      const params: IQueryOptions = {
        $and: [
          {
            _id: inventoryId,
            [namespaceKey]: namespaceValue,
          },
        ],
      };

      const user = req.user as User;

      const {
        all,
        resourceIds,
      } = await this.roleBindingService.getPermittedResources({
        action: 'PATCH',
        namespace: namespaceValue,
        resourceKind: modelName,
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

      const record = await this.baseService.findOne(params);

      if (record) {
        const updatedEntity = await this.baseService.patch(inventoryId, body);
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
    @SetMetadata('action', 'DELETE')
    @RouteDecorators('DELETE')
    @ApiOperation({ operationId: `${modelName}__delete_one` })
    async deleteById(
      @Req() req: Request,
      @Param(namespaceParam) namespaceValue: string,
      @Param('id') inventoryId: string,
    ) {
      const params: IQueryOptions = {
        $and: [
          {
            _id: inventoryId,
            [namespaceKey]: namespaceValue,
          },
        ],
      };

      const user = req.user as User;

      const {
        all,
        resourceIds,
      } = await this.roleBindingService.getPermittedResources({
        action: 'PUT',
        namespace: namespaceValue,
        resourceKind: modelName,
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

      const record = await this.baseService.findOne(params);

      if (record) {
        const updatedEntity = await this.baseService.delete(inventoryId);
        if (updatedEntity) {
          return null;
        }
      }

      throw new NotFoundException();
    }
  }

  return BaseSocietyNamespaceController;
}
