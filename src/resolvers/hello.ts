import { Resolver, Query } from "type-graphql";

@Resolver()
export class HelloResolver {
	// Schema: string query "hello"
	@Query(() => String)
	hello() {
		return "yo";
	}
}
