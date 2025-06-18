import Container from 'typedi';
import AbstractApiClass from '../../common/abstract/api/AbstractApi';
import { Controller } from '../../common/decorator/controller.decorator';
import { ICategory } from '../model/Category-model';
import CategoryRepository from '../repository/category.repository';
import CategoryService from '../service/category.service';

@Controller('/api/v1/category')
export default class CategoryController extends AbstractApiClass<
  ICategory,
  CategoryRepository,
  CategoryService
> {
  protected dropownResponse(data: ICategory[]) {
     return data.map(category => ({
        value: category.name,
        label: category._id
     }));
  }

  protected service = Container.get(CategoryService);
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
