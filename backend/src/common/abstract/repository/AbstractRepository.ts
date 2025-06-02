import { Document, Model } from 'mongoose'; // Assuming you are using Mongoose for your models
import { AppError } from '../../../utils/app-errors';
import pageAbleQuery from '../utils/pageableQuery';

abstract class AbstractRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async save(item: any): Promise<T> {
    const model = new this.model(item);
    const savedItem = await model.save();
    return savedItem;
  }

  async saveAll(items: any[]): Promise<T[]> {
    const savedItems = await this.model.insertMany(items);
    return savedItems;
  }

  async update(item: any): Promise<any> {
    const doc = await this.model.updateOne({ _id: item._id }, item);
    return doc;
  }

  async updateMany(items: any[]): Promise<any> {
    const updateOperations = items.map(({ _id, ...updateData }) => ({
      updateOne: {
        filter: { _id },
        update: { $set: updateData },
      },
    }));
    const doc = await this.model.bulkWrite(updateOperations);
    return doc;
  }

  async deleteById(id: string): Promise<any> {
    const model = await this.model.findById(id);
    if (model) {
      const result = await this.model.deleteOne({ _id: id });
      return result;
    } else {
      throw AppError.notFound('Data Not found', null);
    }
  }

  async findById(id: string): Promise<any> {
    const model = await this.model.findById(id);
    return model;
  }

  async findOneByQuery(query: any, populates: string[] = []): Promise<any> {
    const model = await this.model.findOne(query).populate(populates);
    return model;
  }

  async findByQuery(query: any, populates: string[] = []): Promise<T[]> {
    const model = await this.model.find(query).populate(populates);
    return model;
  }

  async findAll(query: {
    isActive?: boolean;
    pageable?: boolean;
    limit: number;
    offset: number;
    sort: string;
    page: number;
  }): Promise<any> {
    let isActive = true;

    if (query.isActive !== undefined) {
      isActive = query.isActive;
    }

    if (query.pageable) {
      pageAbleQuery(query);
      const data = await this.model
        .find({}, { __v: 0 })
        .where('isActive')
        .equals(isActive)
        .limit(query.limit)
        .skip(query.offset);
      // .sort({ _id: query.sort });
      const currentPage = 1;
      const countData = await this.model.countDocuments();
      const totalPage = Math.ceil(countData / query.limit);
      return {
        data,
        count: countData,
        limit: query.limit,
        currentPage: query.page > 0 ? currentPage + 1 : currentPage,
        page: query.page,
        totalPage,
      };
    } else {
      const data = await this.model
        .find({}, { __v: 0 })
        .where('isActive')
        .equals(isActive);
      return data;
    }
  }
}

export default AbstractRepository;
