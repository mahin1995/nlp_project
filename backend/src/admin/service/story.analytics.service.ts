import { Inject, Service } from 'typedi';
import AbstractService from '../../common/abstract/Service/AbstractService';
import {
  IStoryAnalytics,
  StoryAnalyticsRepository,
} from '../model/Story-analytics';

@Service()
class StoryAnalyticsService extends AbstractService<
  IStoryAnalytics,
  StoryAnalyticsRepository
> {
  @Inject((type) => StoryAnalyticsRepository)
  protected repository!: StoryAnalyticsRepository;
  protected validateInput(input: IStoryAnalytics): Promise<void> {
    return Promise.resolve();
  }
  searchQuery(body: any): Object {
    return {};
  }
  mapInputToModel(input: any) {
    return input;
  }
  mapModelToRes(modelData: any) {
    return modelData;
  }

  async incrementStoryCount(storyId: string): Promise<void> {
    const storyAnalytics = await this.repository
      .getModel()
      .findOne({ storyId });
    if (storyAnalytics) {
      storyAnalytics.count += 1;
      await storyAnalytics.save();
    } else {
      await this.repository.getModel().create({ storyId, count: 1 });
    }
  }

  async getStoryCount(storyId: string): Promise<number> {
    const storyAnalytics = await this.repository
      .getModel()
      .findOne({ storyId });
    return storyAnalytics ? storyAnalytics.count : 0;
  }
  async getStoryIdsByCountOrder(): Promise<{ storyId: string; count: number }[]> {
  const storyAnalyticsList = await this.repository
    .getModel()
    .find({}) 
    .sort({ count: -1 }) 
    .select('storyId count -_id') 
    .limit(4) // Limit to top 100 stories
    .exec();

  return storyAnalyticsList;
}
}
export default StoryAnalyticsService;