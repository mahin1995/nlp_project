import Container, { Inject, Service } from 'typedi';
import NewsRepository from '../../admin/repository/news.repository';
import AbstractService from '../../common/abstract/Service/AbstractService';
// @ts-ignore
import { INews } from '@/admin/model/News-model';

@Service()
class NewsService extends AbstractService<INews, NewsRepository> {
  @Inject(type => NewsRepository)
  protected repository!: NewsRepository;
  mapInputToModel(input: never) {
    return input;
  }
  mapModelToRes(modelData: never) {
    return modelData;
  }
}

export default NewsService;
