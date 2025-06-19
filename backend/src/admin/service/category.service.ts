import { Inject, Service } from 'typedi';
import AbstractService from '../../common/abstract/Service/AbstractService';
// @ts-ignore
import { ICategory } from '../model/Category-model';
import CategoryRepository from '../repository/category.repository';

@Service()
class CategoryService extends AbstractService<ICategory, CategoryRepository> {
  @Inject((type) => CategoryRepository)
  protected repository!: CategoryRepository;
  searchQuery(body: any): Object {
    return {};
  }
  mapInputToModel(input: never) {
    return input;
  }
  mapModelToRes(modelData: never) {
    return modelData;
  }
}

export default CategoryService;
