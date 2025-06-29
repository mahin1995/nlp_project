import { Model } from 'mongoose';
import NewsModel, { INews } from '../../admin/model/News-model';
import AbstractRepository from '../../common/abstract/repository/AbstractRepository';
import { Repository } from '../../common/decorator/repository.decorator';
import AdminUser, { IAdminUser } from '../model/Admin-user-model';
@Repository()
class AdminUserRepository extends AbstractRepository<IAdminUser> {
    validateInput(input: never) {
        throw new Error('Method not implemented.');
    }
 protected model=AdminUser;
  getModel(): Model<IAdminUser> {
        return this.model;
    }
}

export default AdminUserRepository;
