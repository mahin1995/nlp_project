import News, { INews } from '../models/News';
import { PaginatedResult } from '../utils/all_interface';

export const getPaginatedNews = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResult<INews>> => {
  try {
    const skip = (page - 1) * limit;

    const news: INews[] = await News.find({}, { embedding: 0 }) // Exclude embedding
      .sort({ publishedAt: -1 }) // Sort by newest first
      .skip(skip) // Skip previous pages
      .limit(limit) // Limit results per page
      .lean(); // Convert to plain JavaScript objects

    const totalNews: number = await News.countDocuments(); // Get total count

    return {
      data: news,
      currentPage: page,
      totalPages: Math.ceil(totalNews / limit),
      totalItems: totalNews,
    };
  } catch (error) {
    console.error('Error fetching paginated news:', error);
    return { data: [], currentPage: page, totalPages: 0, totalItems: 0 };
  }
};
