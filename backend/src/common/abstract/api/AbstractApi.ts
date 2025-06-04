import { Document } from 'mongoose';

import Logger from '../../../utils/Logger';
import { SwaggerDoc } from '../../decorator/controller.decorator';
import { Get, Patch, Post, Put } from '../../decorator/router.decorator';
import AbstractService from '../Service/AbstractService';
import AbstractRepository from '../repository/AbstractRepository';

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
    bodyExample: {
      title: 'Example News Title',
      content: 'This is sample content for a Create request.',
      category: 'General',
    },
    responses: {
      200: { description: 'Successfully created item' },
    },
  })
  @Post('/create-all')
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
    bodyExample: {
      title: 'Example News Title',
      content: 'This is sample content for a Create request.',
      category: 'General',
    },
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
        schema: { type: 'string', default: 10 },
        description: 'Number of featured items to return',
      },
    ],
    responses: {
      200: { description: 'Successfully created item' },
    },
  })
  @Get('')
  async getALL(req: any, res: any, next: any) {
    try {
      console.log('My Log req: ', req);
      const { page, limit, sort, offset } = req.query;
      const result = await this.service.GetAll(page, limit, sort, offset);
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
  async search(req: any, res: any, next: any) {
    try {
      const body = req.body;
      console.log('My Log body: ',body)
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
    bodyExample: {
      title: 'Example News Title',
      content: 'This is sample content for a Create request.',
      category: 'General',
    },
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
