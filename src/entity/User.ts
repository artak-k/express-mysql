import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude, Expose } from "class-transformer";
import { Session } from "./Session";
import { userManager } from "../service/userManger";
import { File } from "./File";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Exclude()
    @Column({ type: "varchar", length: 256 })
    public password: string;

    @Expose({ groups: ["user", "file"] })
    @Column({ type: "varchar", length: 150, unique: true, })
    public username: string;

    @Exclude()
    @Column({ nullable: true })
    public lastLogin: Date;

    @Exclude()
    @CreateDateColumn({ type: "timestamp" })
    public createdAt: Date;

    @Exclude()
    @UpdateDateColumn({ type: "timestamp" })
    public updatedAt: Date;

    @Exclude()
    @OneToMany(_type => Session, session => session.user, { onDelete: "CASCADE" })
    public sessions: Session[];

    @Exclude()
    @OneToMany(_type => File, file => file.user, { onDelete: "CASCADE" })
    public files: File[];

    constructor(body?: Partial<User>) {
        if (body && typeof body === "object") {
            Object.assign(this, body);
        }
    }

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await userManager.hash(this.password)
        }
    }
}