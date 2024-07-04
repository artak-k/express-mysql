import { Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "files" })
export class File {
    @PrimaryGeneratedColumn()
    public id: number;

    @Expose({ groups: [ "file"] })
    @Column({ type: "varchar", length: 256 })
    public name: string;

    @Expose({ groups: [ "file"] })
    @Column({ type: "varchar", length: 128 })
    public extension: string;

    @Expose({ groups: [ "file"] })
    @Column({ type: "varchar", length: 128 })
    public mimeType: string;

    @Expose({ groups: [ "file"] })
    public size: number;

    @Expose({ groups: [ "file"] })
    @CreateDateColumn()
    public uploadDate: Date;

    @Expose({ groups: [ "file"] })
    @ManyToOne(_type => User, user => user.files, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    public user: User;

    constructor(body?: Partial<File>) {
        if (body && typeof body === "object") {
            Object.assign(this, body);
        }
    }
}