const { GraphQLList, GraphQLID } = require("graphql")

const { UserType, PostType, CommentType } = require("./types")
const { User, Post, Comment } = require("../models/models")

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

const comments = {
    type: new GraphQLList(CommentType),
    description: "List of all comments",
    resolve: () => Comment.find()
}

const comment = {
    type: CommentType,
    description: "Get comment by id",
    args: {
        id: { type: GraphQLID }
    },
    resolve: (_, { id }) => Comment.findById(id)
}

module.exports = { users, user, posts, post, comments, comment }