import Category from '../models/Category';

export const getAll = async () => {
  return await Category.find({});
};
export const getByLink = async (link: string) => {
  return await Category.find({ link }, { createdAt: 0, updatedAt: 0 });
};
