import { MyContext } from "./../types";
import "reflect-metadata";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MikroORM } from "@mikro-orm/core";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { __prod__ } from "./constants";

// create MikroORM instance
const main = async () => {
	// connect to db
	const orm = await MikroORM.init(microConfig);
	// run migrations
	await orm.getMigrator().up();

	// create server
	const app = express();

	const RedisStore = connectRedis(session);
	const redisClient = redis.createClient();

	// add redis session middleware. is used inside apollo
	app.use(
		session({
			name: "qid",
			store: new RedisStore({
				client: redisClient,
				disableTouch: true,
			}),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
				httpOnly: true,
				sameSite: "lax", // csrf (??)
				secure: __prod__, // cookie only works in https
			},
			saveUninitialized: false,
			secret: "wlkefmawelkf",
			resave: false,
		})
	);

	// set up schema for apollo (?)
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			validate: false,
		}),
		// special object that is accessible by all resolvers.
		// passing orm.em object to then use it in resolvers.
		context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
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
