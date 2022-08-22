const { GraphQLObjectType, GraphQLSchema } = require('graphql')

const { users, user, posts, post, comments, comment } = require('./queries')
const { register, login, createPost, editPost, deletePost, createComment, editComment, deleteComment } = require('./mutations')

const QueryType = new GraphQLObjectType({
    name: "queryType",
    description: "The root query type",
    fields: {
        users,
        user,
        posts,
        post,
        comments,
        comment
    }
})

const MutationType = new GraphQLObjectType({
    name: "MutationType",
    description: "The root mutation type",
    fields: {
        register,
        login,
        createPost,
        editPost,
        deletePost,
        createComment,
        editComment,
        deleteComment
    }
})

module.exports = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
})