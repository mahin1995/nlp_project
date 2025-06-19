import { Inject, Service } from 'typedi';
import AbstractService from '../../common/abstract/Service/AbstractService';
// @ts-ignore
import { IAdminUser } from '../model/Admin-user-model';
import AdminUserRepository from '../repository/user.repository';

@Service()
class AdminUserService extends AbstractService<IAdminUser, AdminUserRepository> {
  @Inject((type) => AdminUserRepository)
  protected repository!: AdminUserRepository;
  searchQuery(body: any): Object {
    return {};
  }
  mapInputToModel(input: never) {
    return input;
  }
  mapModelToRes(modelData: never) {
    return modelData;
  }
}

export default AdminUserService;
