const { GraphQLList, GraphQLID } = require("graphql")

const { UserType, PostType } = require("./types")
const { User, Post } = require("../models/models")

const users = {
    type: new GraphQLList(UserType),
    description: "List of all users",
    resolve: () => User.find()
}

const user = {
    type: UserType,
    description: "Get user by id",
    args: {
        id: { type: GraphQLID }
    },
    resolve: (_, args) => User.findById(args.id)
}

const posts = {
    type: new GraphQLList(PostType),
    description: "List of all posts",
    resolve: () => Post.find()
}

const post = {
    type: PostType,
    description: "Get post by id",
    args: {
        id: { type: GraphQLID }
    },
    resolve: (_, args) => Post.findById(args.id)
}

module.exports = { users, user, posts, post }