import { User } from "./../entities/User";
import { MyContext } from "./../../types";
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Resolver,
	Mutation,
	ObjectType,
	Query,
} from "type-graphql";
import argon2 from "argon2";

/*
	@InputType, @ObjectType are used to convert
	the class into type for type-graphql.

	@Field exposes the field to schema.
	Remove it to hide from schema.
*/

// InputType is used for arguments
@InputType()
class UsernamePasswordInput {
	@Field()
	username: string;
	@Field()
	password: string;
}

@ObjectType()
class FieldError {
	@Field()
	field: string;
	@Field()
	message: string;
}

// ObjectType is returned from mutations
@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];
	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	async me(@Ctx() { req, em }: MyContext) {
		// you are not logged in
		if (!req.session.userId) {
			return null;
		}

		const user = await em.findOne(User, { id: req.session.userId });
		return user;
	}

	// Register user
	@Mutation(() => UserResponse)
	async register(
		@Arg("options") options: UsernamePasswordInput,
		@Ctx() { req, em }: MyContext
	): Promise<UserResponse> {
		if (options.username.length <= 2) {
			return {
				errors: [
					{
						field: "username",
						message: "too short username",
					},
				],
			};
		}

		if (options.password.length <= 2) {
			return {
				errors: [
					{
						field: "password",
						message: "too short password",
					},
				],
			};
		}

		const hashedPassword = await argon2.hash(options.password);
		const user = em.create(User, {
			username: options.username,
			password: hashedPassword,
		});
		try {
			await em.persistAndFlush(user);
		} catch (err) {
			// duplicate user err
			if (err.code === "23505") {
				return {
					errors: [
						{
							field: "username",
							message: "user alread exists",
						},
					],
				};
			}
			console.log("message: ", err.message);
		}
		return { user };
	}

	// Login user
	@Mutation(() => UserResponse)
	async login(
		@Arg("options") options: UsernamePasswordInput,
		@Ctx() { em, req }: MyContext
	): Promise<UserResponse> {
		const user = await em.findOne(User, {
			username: options.username.toLowerCase(),
		});
		if (!user) {
			return {
				errors: [
					{
						field: "username",
						message: "user doesn't exist",
					},
				],
			};
		}
		const valid = await argon2.verify(user.password, options.password);
		if (!valid) {
			return {
				errors: [
					{
						field: "password",
						message: "password doesn't match",
					},
				],
			};
		}

		// store user id session
		// this will set a cookie on the user
		req.session.userId = user.id;
		return { user };
	}
}
