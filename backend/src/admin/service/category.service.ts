import { Inject, Service } from 'typedi';
import AbstractService from '../../common/abstract/Service/AbstractService';
// @ts-ignore
import { SearchBuilder } from '../../utils/SearchBuilder';
import { ICategory } from '../model/Category-model';
import CategoryRepository from '../repository/category.repository';

@Service()
class CategoryService extends AbstractService<ICategory, CategoryRepository> {
  protected validateInput(input: ICategory): Promise<void> {
    // Implement validation logic here
    return Promise.resolve();
  }
  @Inject((type) => CategoryRepository)
  protected repository!: CategoryRepository;
  searchQuery(body: any): Object {
    const query = SearchBuilder.create<ICategory>()
      .where('name')
      .like(`%${body?.name || ''}%`)
      .build();
    return query;
  }
  mapInputToModel(input: never) {
    return input;
  }
  mapModelToRes(modelData: never) {
    return modelData;
  }
}

export default CategoryService;
