import { Document } from 'mongoose';

import Logger from '../../../utils/Logger';
import { Get, Patch, Post, Put } from '../../decorator/router.decorator';
import AbstractService from '../Service/AbstractService';
import AbstractRepository from '../repository/AbstractRepository';

abstract class AbstractApiClass<
  T extends Document,
  R extends AbstractRepository<T>,
  S extends AbstractService<T, R>,
> {
  protected abstract service: S;

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
  @Get('')
  async getALL(req: any, res: any, next: any) {
    try {
      const query = req.query;
      const { data } = await this.service.GetAll(query);
      return res.json(data);
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }
  @Get('/search')
  async search(req: any, res: any, next: any) {
    try {
      const query = req.body;
      const { data } = await this.service.Search(query);
      return res.json(data);
    } catch (error) {
      Logger.logError(error);
      next(error);
    }
  }
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
