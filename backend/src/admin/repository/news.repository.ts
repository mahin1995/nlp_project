import NewsModel, { INews } from '../../admin/model/News-model';
import AbstractRepository from '../../common/abstract/repository/AbstractRepository';
import { Repository } from '../../common/decorator/repository.decorator';
@Repository()
class NewsRepository extends AbstractRepository<INews> {
  constructor() {
    super(NewsModel);
  }
}

export default NewsRepository;
