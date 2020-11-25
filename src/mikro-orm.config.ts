import { __prod__ } from "./constants";
import { User } from './entities/User';
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import { POSTGRES_USER, POSTGRES_PASSWORD } from "./constants";
import path from "path";

export default {
	migrations: {
		path: path.join(__dirname, "./migrations"),
		pattern: /^[\w-]+\d+\.[tj]s$/,
	},
	entities: [Post, User],
	user: POSTGRES_USER,
	password: POSTGRES_PASSWORD,
	dbName: "lilreddit",
	type: "postgresql",
	debug: !__prod__,
	// typescript black magic to get autocompletion.
	// get types from `init` function:
} as Parameters<typeof MikroORM.init>[0];
