import { Admin } from "src/entities/admin.entity";
import { User } from "src/entities/users.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Admin)
export class AdminRepository extends Repository<Admin>{
    async createAdmin(user: User){
        const Admin = this.create();
        Admin.user = user;

        return await Admin.save();
    }
}