import { AppDataSource } from "../dataSource";
import { Session } from "../entity/Session";
import { User } from "../entity/User";

export const SessionRepository = AppDataSource.getRepository(Session).extend({
  findByIdWithUser(id: number) {
    return this.createQueryBuilder("s")
      .innerJoinAndSelect("s.user", "u")
      .where("s.id = :id", { id })
      .getOne();
  },
  findUserSessions(user: User) {
    return this.createQueryBuilder("s")
      .innerJoin("s.user", "u")
      .where("u.id = :id", { id: user.id })
      .getMany();
  }
});