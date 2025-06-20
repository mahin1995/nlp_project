import { Document } from 'mongoose';

import { NextFunction, Request, Response } from 'express';
import { protect } from '../../../admin/middleware/auth.middleware';
import Logger from '../../../utils/Logger';
import {
  Body,
  Next,
  Param,
  Query,
  Req,
  Res,
  SwaggerDoc,
} from '../../decorator/controller.decorator';
import { Middleware } from '../../decorator/middleware.decorator';
import {
  Delete,
  Get,
  Patch,
  Post,
  Put,
} from '../../decorator/router.decorator';
import AbstractService from '../Service/AbstractService';
import AbstractRepository from '../repository/AbstractRepository';
import { ACTIVE_STATUS } from '../utils/constant';

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

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
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any
  ) {
    try {
      const input = body;
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
  async createMultiple(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any
  ) {
    try {
      const input = body;
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
  @Delete('/:id')
  @Middleware(protect)
  async delete(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param('id') id: string
  ) {
    try {
      if (!id) {
        return res.status(400).json({ message: 'ID is required' });
      }
      const { data } = await this.service.delete(id);
      return res.json(data);
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }
  @Patch('/:id')
  @Middleware(protect)
  async reActive(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param('id') id: string
  ) {
    try {
      if (!id) {
        return res.status(400).json({ message: 'ID is required' });
      }
      const { data } = await this.service.reActive(id);
      return res.json(data);
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }
  @Put('')
  @Middleware(protect)
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any,
    @Query() query: any
    // @Param("id") id: string | undefined = undefined
  ) {
    try {
      const input = body;
      input.updatedBy = req.user || '';
      const { data } = await this.service.update(input);
      return res.status(202).json(data);
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }
  @Put('/update-all')
  @Middleware(protect)
  async updateMany(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any
  ) {
    try {
      const value = await this.service.updateMultipleItem(body);
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
  async getALL(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Query() query: any
  ) {
    try {
      const { page, limit, sort, status } = query;
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
      return res.status(200).json(result);
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
  async search(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() body: any,
    @Query() query: any
  ) {
    try {
      if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ message: 'Search body cannot be empty' });
      }
      const { page, limit } = query;
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
  async getById(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param('id') id: string
  ) {
    try {
      const { data } = await this.service.GetById(id);
      return res.json(data);
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }

  protected abstract dropownResponse(data: T[]): any;
  @SwaggerDoc({
    summary: 'Get drop down list',

    parameters: [],
    responses: {
      200: { description: 'Successfully Get Item' },
    },
  })
  @Get('/drop-down/list')
  @Middleware(protect)
  async getDropDown(@Res() res: Response, @Next() next: NextFunction) {
    try {
      const { data } = await this.service.GetAll();
      let result = this.dropownResponse(data);
      return res.json(result);
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }
}

export default AbstractApiClass;
