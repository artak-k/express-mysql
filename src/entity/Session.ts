import { Exclude, Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity({ name: "sessions" })
export class Session {
  @Expose({ groups: ["session"] })
  @PrimaryGeneratedColumn()
  public id: number;

  @Exclude()
  @ManyToOne(_type => User, user => user.sessions, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  public user: User;

  @Expose({ groups: ["session"] })
  @Column({ nullable: true })
  public lastActiveDate: Date;

  @Exclude()
  @Column({ nullable: false })
  public secret: string;

  @Exclude()
  @CreateDateColumn()
  public createdAt: Date;

  constructor(body?: Partial<Session>) {
    if (body && typeof body === "object") {
      Object.assign(this, body);
    }
  }

}