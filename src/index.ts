import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

// create MikroORM instance
const main = async () => {
	// connect to db
	const orm = await MikroORM.init(microConfig);
	// run migrations
	await orm.getMigrator().up();

	// Examples:

	// run sql
	// const post = orm.em.create(Post, { title: "my post" });

	// instert in db
	// await orm.em.persistAndFlush(post);

	// Get all posts in db
	// const posts = await orm.em.find(Post, {});
	// console.log(posts);
};

main().catch((err) => {
	console.error(err);
});

console.log("hello world");
