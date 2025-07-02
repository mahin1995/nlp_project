import StoryAnalyticsModel from '../models/Story-analytics';

export const StoryAnalyticsService = {
  async getPopluarStories(
    limit: number = 10
  ): Promise<{ storyId: string; count: number }[]> {
    try {
      const storyAnalyticsList = await StoryAnalyticsModel.find({})
        .sort({ count: -1 }) // Sort by count in descending order
        .select('storyId count -_id') // Select only storyId and count, exclude _id
        .limit(limit) // Limit to the specified number of stories
        .exec();

      return storyAnalyticsList.map((item) => ({
        storyId: item.storyId,
        count: item.count,
      }));
    } catch (error) {
      console.error('Error fetching popular stories:', error);
      return [];
    }
  },
};
