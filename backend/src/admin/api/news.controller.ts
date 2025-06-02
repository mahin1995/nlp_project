  import Container from 'typedi';
import NewsRepository from '../../admin/repository/news.repository';
  import NewsService from '../../admin/service/news.service';
  import AbstractApiClass from '../../common/abstract/api/AbstractApi';
  import { Controller } from '../../common/decorator/controller.decorator';
  import { INews } from '../model/News-model';

  @Controller('/api/news')
  export default class NewsController extends AbstractApiClass<
    INews,
    NewsRepository,
    NewsService
  > {
    protected service = Container.get(NewsService);
    //   @Get('')
    //   @Middleware((req: any, res: any, next: any) => {
    //     console.log('Middleware 1');
    //     next();
    //   })
    //   async getALL(req: any, res: any, next: any) {
    //     const body: any = { message: 'Get all users' };
    //     res.json(body);
    //   }
  }
