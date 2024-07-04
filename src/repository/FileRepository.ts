import { AppDataSource } from "../dataSource";
import { File } from "../entity/File";

export const FileRepository = AppDataSource.getRepository(File).extend({
    getFiles(from: number = 0, count: number = 10) {
        return this.createQueryBuilder("f")
            .leftJoinAndSelect("f.user", "u")
            .offset(from)
            .limit(count)
            .getMany();
    }
});