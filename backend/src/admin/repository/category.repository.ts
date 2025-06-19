import { Model } from 'mongoose';
import AbstractRepository from '../../common/abstract/repository/AbstractRepository';
import { Repository } from '../../common/decorator/repository.decorator';
import CategoryModel, { ICategory } from '../model/Category-model';
@Repository()
class CategoryRepository extends AbstractRepository<ICategory> {
  getModel(): Model<ICategory> {
    return this.model;
  }
  protected model = CategoryModel;
}

export default CategoryRepository;
