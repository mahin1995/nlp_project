import { Document } from 'mongoose';
import 'reflect-metadata';
import { PaginatedResult } from '../../../utils/all_interface';
import { AppError } from '../../../utils/app-errors';
import AbstractRepository from '../repository/AbstractRepository';

abstract class AbstractService<
  T extends Document,
  R extends AbstractRepository<T>,
> {
  //   repository: R;

  protected abstract repository: R;

  async Create(input: T) {
    try {
      const modifying = this.mapInputToModel(input);
      const result = await this.repository.save(modifying);
      return this.FormateData(result);
    } catch (error) {
      throw AppError.internal('Unable to Create ', {
        error,
        Service: this.constructor.name,
      });
    }
  }

  async saveMultipleItem(input: T[]) {
    try {
      const modifying = this.mapInputToModel(input);
      const data = await this.repository.saveAll(modifying);
      return data;
    } catch (error) {
      throw AppError.internal('Unable to Create ', {
        error,
        Service: this.constructor.name,
      });
    }
  }

  async updateMultipleItem(input: T[]) {
    try {
      const data = await this.repository.updateMany(input);
      return data;
    } catch (error) {
      throw AppError.internal('Unable to Update ', {
        error,
        Service: this.constructor.name,
      });
    }
  }

  async GetAll(
    {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      offset = 0,
      isActive = true,
    } = {} as {
      page?: number;
      limit?: number;
      sort?: string;
      offset?: number;
      isActive?: boolean;
    }
  ): Promise<PaginatedResult<T>> {
    try {
      const data = await this.repository.findAll({
        page,
        limit,
        sort,
        pageable: true,
        isActive,
      });
      return {
        data: data.data,
        currentPage: data.currentPage,
        totalPages: data.totalPage,
        totalItems: data.count,
      };
    } catch (error) {
      throw AppError.notFound('Data not Found ', {
        error,
        Service: this.constructor.name,
      });
    }
  }
  abstract searchQuery(body: any): Object;
  async Search(body: any, page: any, limit: any) {
    try {
      const filter = this.searchQuery(body);
      let model = this.repository.getModel().find(filter);
      if (page && limit) {
        model = model.skip((page - 1) * limit).limit(limit);
      }

      const paginatedData = await model.exec();
      if (paginatedData.length === 0) {
        throw AppError.notFound('No Data Found', null);
      }
      const totalCount: number = await this.repository
        .getModel()
        .countDocuments(filter);
      const totalPages = Math.ceil(totalCount / limit);
      const modifydata = this.mapModelToRes(paginatedData);
      return {
        data: modifydata,
        currentPage: page || 1,
        totalPages: totalPages || 1,
        totalItems: totalCount || 0,
      };
    } catch (error) {
      throw AppError.internal('Unable to Search ', {
        error,
        Service: this.constructor.name,
      });
    }
  }

  async GetById(id: string) {
    try {
      if (id === undefined || id === null)
        throw AppError.internal('ID is not provided', null);
      const data = await this.repository.findById(id);
      return this.FormateData(data);
    } catch (error) {
      throw AppError.notFound('Data Not found', {
        error,
        Service: this.constructor.name,
      });
    }
  }

  async delete(id: string) {
    try {
      if (id === undefined || id === null)
        throw AppError.internal('ID is not provided', null);
      const data = await this.repository.deleteById(id);
      return this.FormateData(data);
    } catch (error) {
      throw AppError.notFound('Data Not found', {
        error,
        Service: this.constructor.name,
      });
    }
  }

  async update(input: T) {
    try {
      const modifying = this.mapInputToModel(input);
      const data = await this.repository.update(modifying);
      return this.FormateData(data);
    } catch (error) {
      throw AppError.badRequest('Update not possible', {
        error,
        Service: this.constructor.name,
      });
    }
  }

  abstract mapInputToModel(input: any): any;

  abstract mapModelToRes(modelData: any): any;
  async testService() {
    return await this.repository.findAll({
      limit: 0,
      offset: 0,
      sort: '',
      page: 0,
    });
  }
  FormateData(data: any): { data: any } {
    if (data) {
      return { data };
    } else {
      // return { data }
      throw AppError.notFound('Data Not found', null);
    }
  }
}

export default AbstractService;
