import { PaginatedResult, Response } from '../../utils/all_interface';
import Category, { ICategoryOut } from '../models/Category';
import News, { INews } from '../models/News';

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
export const getLatestPopularHotTopicNews = async (): Promise<{
  [key: string]: INews[];
}> => {
  try {
    const news: INews[] = await News.find({}, { embedding: 0 }) // Exclude embedding
      .sort({ publishedAt: -1 }) // Sort by newest first
      .limit(4);

    // Get total count
    let data: { [key: string]: any[] } = {};
    const mappedNews = news.map((item, idx) => ({
      id: item._id,
      imageUrl: item?.image || '',
      title: item.title,
      time: item.publishedAt ? new Date(item.publishedAt).toLocaleString() : '',
      category: (item as any).category?.Name || 'General',
    }));
    data['LATEST'] = mappedNews;
    data['POPULAR'] = mappedNews;
    data['HOT-TOPIC'] = mappedNews;
    return data;
  } catch (error) {
    console.error('Error fetching paginated news:', error);
    return { message: 'something went wrong', data: [] } as any;
  }
};

export const getSingleNews = async (id: String): Promise<Response<INews>> => {
  try {
    const news: INews | null = await News.findById(id, {
      embedding: 0,
    }).populate('category');

    return {
      data: news,
    };
  } catch (error) {
    console.error('Error fetching paginated news:', error);
    return { data: null, message: 'sumthing went wrong' };
  }
};
export const getPageDataByCategory = async (
  page: number = 1,
  limit: number = 10,
  category: string
): Promise<PaginatedResult<INews>> => {
  try {
    const skip = (page - 1) * limit;
    const categoryObj: ICategoryOut | null = await Category.findOne({
      link: category,
    });
    const news: INews[] = await News.find(
      { category: categoryObj?._id },
      { embedding: 0 }
    ) // Exclude embedding
      .sort({ publishedAt: -1 }) // Sort by newest first
      .skip(skip) // Skip previous pages
      .limit(limit) // Limit results per page
      .lean(); // Convert to plain JavaScript objects

    const totalNews: number = await News.find({
      category: categoryObj?._id,
    }).countDocuments(); // Get total count

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

export const getHomeDataCategoryWish = async () => {
  try {
    try {
      const newsByCategory = await News.aggregate([
        {
          $lookup: {
            from: 'categories', // Make sure this matches your collection name
            localField: 'category',
            foreignField: '_id',
            as: 'categoryDetails',
          },
        },
        { $unwind: '$categoryDetails' },
        {
          $sort: { publishedAt: -1 }, // Sort news by publishAt in descending order
        },
        {
          $group: {
            _id: '$categoryDetails._id',
            categoryName: { $first: '$categoryDetails.name' },
            news: { $push: '$$ROOT' },
          },
        },
        {
          $project: {
            _id: 0,
            categoryName: 1,
            news: { $slice: ['$news', 10] }, // Limit to 10 news per category
          },
        },
      ]);

      return newsByCategory;
    } catch (error) {
      console.error('Error fetching news by category:', error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching paginated news:', error);
    return {};
  }
};
