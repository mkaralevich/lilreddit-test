import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
	migrations: {
		path: path.join(__dirname, "./migrations"),
		pattern: /^[\w-]+\d+\.[tj]s$/,
	},
	entities: [Post],
	user: "postgres",
	password: "i4aNOm&POnek",
	dbName: "lilreddit",
	type: "postgresql",
	debug: !__prod__,
	// typescript black magic to get autocompletion.
	// get types from `init` function:
} as Parameters<typeof MikroORM.init>[0];
