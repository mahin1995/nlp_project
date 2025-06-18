import Container from 'typedi';
import AbstractApiClass from '../../common/abstract/api/AbstractApi';
import { Controller } from '../../common/decorator/controller.decorator';
import { IAdminUser } from '../model/Admin-user-model';
import AdminUserRepository from '../repository/user.repository';
import AdminUserService from '../service/user.service';

@Controller('/api/v1/users')
export default class AdminUserController extends AbstractApiClass<
  IAdminUser,
  AdminUserRepository,
  AdminUserService
> {
  protected dropownResponse(data: IAdminUser[]) {
    return data.map((user) => ({
      id: user.id,
      name: user.username || user.email,
    }));
  }

  protected service = Container.get(AdminUserService);
}
