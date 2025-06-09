import { Inject, Service } from 'typedi';
import NewsRepository from '../../admin/repository/news.repository';
import AbstractService from '../../common/abstract/Service/AbstractService';
// @ts-ignore
import pageAbleQuery from '../../common/abstract/utils/pageableQuery';
import { SearchBuilder } from '../../utils/SearchBuilder';
import { PaginatedResult } from '../../utils/all_interface';
import { INews } from '../model/News-model';

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
  async GetAll(
    page?: number,
    limit?: number,
    sort?: any,
    offset?: number
  ): Promise<PaginatedResult<INews>> {
    ({ page, limit, sort, offset } = pageAbleQuery({
      page,
      limit,
      sort,
      offset,
    }));
    let qt = this.repository
      .getModel()
      .find({})
      .where('isActive')
      .equals(true)
      .limit(limit || 10)
      .skip(offset || 0)
      .sort({ publishedAt: sort || -1 })
      .select({ __v: 0, createdAt: 0, updatedAt: 0, content: 0, isActive: 0 });
    let data = await qt.exec();
    // TODO: Implement actual logic
    const countData = await this.repository.getModel().countDocuments();
    const totalPage = Math.ceil(countData / (limit ?? 10));
    return Promise.resolve({
      data: data,
      total: countData,
      limit: limit ?? 10,
      currentPage: page ?? 1,
      totalPages: totalPage,
      totalItems: countData,
    });
  }
}

export default NewsService;
