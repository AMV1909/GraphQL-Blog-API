const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = require("graphql");
const { User, Post, Comment } = require("../models/models");

const UserType = new GraphQLObjectType({
    name: "UserType",
    description: "The user type",
    fields: {
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        displayName: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }
})

const PostType = new GraphQLObjectType({
    name: "PostType",
    description: "The post type",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        body: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        author: { 
            type: UserType,
            resolve: ({ authorId }) => {
                return User.findById(authorId)
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve: ({ id }) => {
                return Comment.find({ postId: id })
            }
        }
    })
})

const CommentType = new GraphQLObjectType({
    name: "CommentType",
    description: "The comment type",
    fields: {
        id: { type: GraphQLID },
        user: {
            type: UserType,
            resolve: ({ userId }) => {
                return User.findById(userId)
            }
        },
        post: { 
            type: PostType,
            resolve: ({ postId }) => {
                return Post.findById(postId)
            }
        },
        comment: { type: GraphQLString }
    }
})

module.exports = { UserType, PostType, CommentType }