import { User } from "../entity/User";
import { AppDataSource } from "../dataSource";


export const UserRepository = AppDataSource.getRepository(User).extend({
    findByUsername(username: string) {
        const q = this.createQueryBuilder("u")
            .where("u.username = :username", {username});
        return q.getOne();
    }
})