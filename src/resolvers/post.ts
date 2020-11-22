import { Post } from './../entities/Post';
import { Resolver, Query } from "type-graphql";

@Resolver()
export class PostResolver {
	// Typescript is going to use Post as an object type.
	// Post needs to be converted to be a type.
	@Query(() => [Post])
	posts() {
		return "yo";
	}
}
