import Container from 'typedi';
import NewsRepository from '../../admin/repository/news.repository';
import NewsService from '../../admin/service/news.service';
import AbstractApiClass from '../../common/abstract/api/AbstractApi';
import { Controller } from '../../common/decorator/controller.decorator';
import { INews } from '../model/News-model';
import { SearchBuilder } from '../../utils/SearchBuilder';

@Controller('/api/v1/news')
export default class NewsController extends AbstractApiClass<
  INews,
  NewsRepository,
  NewsService
> {
 
  protected service = Container.get(NewsService);
}
