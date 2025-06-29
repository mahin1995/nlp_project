import { Inject, Service } from 'typedi';
import AbstractService from '../../common/abstract/Service/AbstractService';
// @ts-ignore
import { AppError } from '../../utils/app-errors';
import { IAdminUser } from '../model/Admin-user-model';
import AdminUserRepository from '../repository/user.repository';

@Service()
class AdminUserService extends AbstractService<
  IAdminUser,
  AdminUserRepository
> {
  protected async validateInput(input: IAdminUser): Promise<void> {
    let data = await this.repository.getModel().find({
      $or: [{ email: input.email }, { username: input.username }],
    });

    if (data.length > 0) {
      // Check specifically which field is duplicated (optional)
      const duplicateFields = data.map((d) => {
        if (d.email === input.email) {
          return 'Email';
        } else if (d.username === input.username) {
          return 'Username';
        }
        return '';
      });
      throw AppError.badRequest(
        `${[...new Set(duplicateFields)].join(' and ')} already exists`
      );
      //   throw new Error(
      //     `${[...new Set(duplicateFields)].join(' and ')} already exists`
      //   );
    }
  }
  @Inject((type) => AdminUserRepository)
  protected repository!: AdminUserRepository;
  searchQuery(body: any): Object {
    return {};
  }
  mapInputToModel(input: IAdminUser) {
    return input;
  }
  mapModelToRes(modelData: never) {
    return modelData;
  }
}

export default AdminUserService;
