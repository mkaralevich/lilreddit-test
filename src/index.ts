import { Post } from './entities/Post';
import "reflect-metadata";
import { PostResolver } from "./resolvers/post";
import { HelloResolver } from "./resolvers/hello";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

// create MikroORM instance
const main = async () => {
	// connect to db
	const orm = await MikroORM.init(microConfig);
	// run migrations
	await orm.getMigrator().up();

	// create server
	const app = express();
	// set up schema for apollo (?)
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver],
			validate: false,
		}),
		// special object that is accessible by all resolvers.
		// passing orm.em object to then use it in resolvers.
		context: () => ({ em: orm.em }),
	});

	// create graphql endpoint on express
	apolloServer.applyMiddleware({ app });

	app.get("/", (_, res) => {
		res.send("hi");
	});
	app.listen(4001, () => {
		console.log("server started on localhost:4001");
	});
};

main().catch((err) => {
	console.error(err);
});

console.log("hello world");
