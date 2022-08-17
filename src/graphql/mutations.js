const { GraphQLString } = require("graphql")

const { User, Post } = require("../models/models")
const { createJWtToken } = require("../util/auth")
const { PostType } = require("./types")

const register = {
    type: GraphQLString,
    description: "Register a new user and returns a token",
    args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        displayName: { type: GraphQLString }
    },
    resolve: async (_, args) => {
        const { username, password, email, displayName } = args

        const newUser = await User.create({username, password, email, displayName})

        const token = createJWtToken({_id: newUser._id, username: newUser.username, email: newUser.email})

        return token
    }
}

const login = {
    type: GraphQLString,
    description: "Login a user and returns a token",
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    resolve: async (_, args) => {
        const user = await User.findOne({email: args.email}).select("+password")

        if(!user || args.password !== user.password) {
            throw new Error("Invalid credentials")
        }

        const token = createJWtToken({_id: user._id, username: user.username, email: user.email})

        return token
    }
}

const createPost = {
    type: PostType,
    description: "Create a new post",
    args: {
        title: { type: GraphQLString },
        body: { type: GraphQLString }
    },
    resolve: async (_, args, { verifiedUser }) => {
        const newPost = new Post({
            title: args.title,
            body: args.body,
            authorId: verifiedUser._id
        })

        return await newPost.save()
    }
}

module.exports = { register, login, createPost }