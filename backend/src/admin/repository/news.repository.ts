import { Model } from 'mongoose';
import NewsModel, { INews } from '../../admin/model/News-model';
import AbstractRepository from '../../common/abstract/repository/AbstractRepository';
import { Repository } from '../../common/decorator/repository.decorator';
@Repository()
class NewsRepository extends AbstractRepository<INews> {
 protected model=NewsModel;
  getModel(): Model<INews> {
        return this.model;
    }
}

export default NewsRepository;
