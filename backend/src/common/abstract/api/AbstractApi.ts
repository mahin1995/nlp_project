import { Document } from 'mongoose';

import { protect } from '../../../admin/middleware/auth.middleware';
import Logger from '../../../utils/Logger';
import { SwaggerDoc } from '../../decorator/controller.decorator';
import { Middleware } from '../../decorator/middleware.decorator';
import { Get, Patch, Post, Put } from '../../decorator/router.decorator';
import AbstractService from '../Service/AbstractService';
import AbstractRepository from '../repository/AbstractRepository';
import { ACTIVE_STATUS } from '../utils/constant';

abstract class AbstractApiClass<
  T extends Document,
  R extends AbstractRepository<T>,
  S extends AbstractService<T, R>,
> {
  protected abstract service: S;
  @SwaggerDoc({
    summary: 'Create a new item',
    bodyExample: {
      title: 'Example News Title',
      content: 'This is sample content for a Create request.',
      category: 'General',
    },
    responses: {
      200: { description: 'Successfully created item' },
    },
  })
  @Post('')
  @Middleware(protect)
  async create(req: any, res: any, next: any) {
    try {
      const input = req.body;
      input.createdBy = req.user;
      input.updatedBy = req.user;
      const { data } = await this.service.Create(input);
      return res.json(data);
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }
  @SwaggerDoc({
    summary: 'Create a new item',
    responses: {
      200: { description: 'Successfully created item' },
    },
  })
  @Post('/create-all')
  @Middleware(protect)
  async createMultiple(req: any, res: any, next: any) {
    try {
      const input = req.body;
      input.createdBy = req.user;
      input.updatedBy = req.user;
      const result: any = await this.service.saveMultipleItem(input);
      const { data } = result;
      return res.json(data);
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }
  @Patch('/:id')
  @Middleware(protect)
  async delete(req: any, res: any, next: any) {
    try {
      const { id } = req.params;
      const { data } = await this.service.delete(id);
      return res.json(data);
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }
  @Put('')
  @Middleware(protect)
  async update(req: any, res: any, next: any) {
    try {
      const input = req.body;
      input.updatedBy = req.user;
      const { data } = await this.service.update(input);
      return res.status(202).json(data);
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }
  @Put('/update-all')
  @Middleware(protect)
  async updateMany(req: any, res: any, next: any) {
    try {
      const input = req.body;
      const value = await this.service.updateMultipleItem(input);
      return res.status(202).json({ message: 'Successfully update' });
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }
  @SwaggerDoc({
    summary: 'Create a new item',
    parameters: [
      {
        in: 'query',
        name: 'page',
        schema: { type: 'integer', default: 1 },
        description: 'Number of featured items to return',
      },
      {
        in: 'query',
        name: 'limit',
        schema: { type: 'integer', default: 10 },
        description: 'Number of featured items to return',
      },
      {
        in: 'query',
        name: 'sort',
        schema: { type: 'string', default: 'asc' },
        description: 'Give sort order',
      },
      {
        in: 'query',
        name: 'status',
        schema: { type: 'string', default: 'active' },
        description: 'Give active or inactive status',
      },
    ],
    responses: {
      200: { description: 'Successfully created item' },
    },
  })
  @Get('')
  @Middleware(protect)
  async getALL(req: any, res: any, next: any) {
    try {
      const { page, limit, sort, status } = req.query;
      let isActive = ACTIVE_STATUS.ACTIVE;
      if (status == 'active') {
        isActive = ACTIVE_STATUS.ACTIVE;
      } else {
        isActive = ACTIVE_STATUS.INACTIVE;
      }
      const result = await this.service.GetAll({
        page,
        limit,
        sort,
        isActive,
      });
      return res.json(result);
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }

  @SwaggerDoc({
    summary: 'Create a new item',
    parameters: [
      {
        in: 'query',
        name: 'page',
        schema: { type: 'integer', default: 1 },
        description: 'Number of featured items to return',
      },
      {
        in: 'query',
        name: 'limit',
        schema: { type: 'integer', default: 10 },
        description: 'Number of featured items to return',
      },
    ],
    responses: {
      200: { description: 'Successfully Get Item' },
    },
  })
  @Post('/search')
  @Middleware(protect)
  async search(req: any, res: any, next: any) {
    try {
      const body = req.body;
      const { page, limit } = req.query;
      const result = await this.service.Search(body, page, limit);
      return res.json(result);
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }
  @SwaggerDoc({
    summary: 'Create a new item',

    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: 'Item ID',
      },
    ],
    responses: {
      200: { description: 'Successfully Get Item' },
    },
  })
  @Get('/:id')
  @Middleware(protect)
  async getById(req: any, res: any, next: any) {
    try {
      const { id } = req.params;
      const { data } = await this.service.GetById(id);
      return res.json(data);
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }
}

export default AbstractApiClass;
