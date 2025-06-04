import { Inject, Service } from 'typedi';
import NewsRepository from '../../admin/repository/news.repository';
import AbstractService from '../../common/abstract/Service/AbstractService';
// @ts-ignore
import { INews } from '@/admin/model/News-model';
import { SearchBuilder } from '../../utils/SearchBuilder';

@Service()
class NewsService extends AbstractService<INews, NewsRepository> {
  @Inject((type) => NewsRepository)
  protected repository!: NewsRepository;
  searchQuery(body: any) {
    const query = SearchBuilder.create<INews>()
      .where('title')
      .like(`%${body?.title || ''}%`)
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

export default NewsService;
