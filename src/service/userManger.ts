import * as bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { Session } from "../entity/Session";
import { User } from "../entity/User";

class UserManager {
    async hash(password: string, salt = 8) {
        return await bcrypt.hash(password, salt);
    }

    async verify(password: string, user: User) {
        return await bcrypt.compare(password, user.password);
    }

    async loginUser(user: User) {
        const session = new Session({
            user,
            secret: nanoid(16),
            lastActiveDate: new Date()
        });

        user.lastLogin = new Date();

        return session;
    }
}

export const userManager = new UserManager();