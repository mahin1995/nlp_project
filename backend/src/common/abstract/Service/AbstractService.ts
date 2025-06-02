import { Document } from 'mongoose';

import { AppError } from '../../../utils/app-errors';
import AbstractRepository from '../repository/AbstractRepository';

abstract class AbstractService<
  T extends Document,
  R extends AbstractRepository<T>,
> {
  //   repository: R;

  constructor(private repository: R) {
    this.repository = repository;
  }

  async Create(input: T) {
    try {
      const modifying = this.mapInputToModel(input);
      const result = await this.repository.save(modifying);
      return FormateData(result);
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

  async GetAll(query: any) {
    try {
      const data = await this.repository.findAll(query);
      const modifydata = this.mapModelToRes(data);
      return FormateData(modifydata);
    } catch (error) {
      throw AppError.notFound('Data not Found ', {
        error,
        Service: this.constructor.name,
      });
    }
  }

  async Search(query: any) {
    try {
      const data = await this.repository.findByQuery(query, []);
      const modifydata = this.mapModelToRes(data);
      return FormateData(modifydata);
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
      return FormateData(data);
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
      return FormateData(data);
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
      return FormateData(data);
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
}

export default AbstractService;

function FormateData(data: any): { data: any } {
  if (data) {
    return { data };
  } else {
    // return { data }
    throw AppError.notFound('Data Not found', null);
  }
}
