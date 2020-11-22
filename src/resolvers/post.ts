import { MyContext } from "./../../types";
import { Resolver, Query, Ctx } from "type-graphql";
import { Post } from "./../entities/Post";

@Resolver()
export class PostResolver {
	// Typescript is going to use Post as an object type.
	// Post needs to be converted to be a type.
	@Query(() => [Post])
	// accessing orm.em object to find posts etc.
	posts(@Ctx() { em }: MyContext): Promise<Post[]> {
		return em.find(Post, {});
	}
}
