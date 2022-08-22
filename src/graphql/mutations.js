const { GraphQLString, GraphQLID } = require("graphql")

const { User, Post, Comment } = require("../models/models")
const { createJWtToken } = require("../util/auth")
const { PostType, CommentType } = require("./types")

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
    resolve: async (_, { email, password }) => {
        const user = await User.findOne({email: email}).select("+password")

        if(!user || password !== user.password) {
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
    resolve: async (_, { title, body }, { verifiedUser }) => {
        const newPost = await new Post({
            title: title,
            body: body,
            authorId: verifiedUser._id
        })

        return newPost.save()
    }
}

const editPost = {
    type: PostType,
    description: "Edit a post",
    args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        body: { type: GraphQLString }
    },
    resolve: async (_, { id, title, body }, { verifiedUser }) => {
        if (!verifiedUser) {
            throw new Error("You must be logged in to update a post")
        }

        const updatedPost = await Post.findOneAndUpdate(
            { _id: id, authorId: verifiedUser._id },
            { title, body },
            { new: true, runValidators: true }
        )

        if (!updatedPost) {
            throw new Error("You do not have permission to update this post")
        }

        return updatedPost
    }
}

const deletePost = {
    type: GraphQLString,
    description: "Delete a post",
    args: {
        id: { type: GraphQLID }
    },
    resolve: async (_, { id }, { verifiedUser }) => {
        if (!verifiedUser) {
            throw new Error("You must be logged in to delete a post")
        }

        const deletedPost = await Post.findOneAndDelete({ _id: id, authorId: verifiedUser._id })

        if (!deletedPost) {
            throw new Error("You do not have permission to delete this post")
        }

        return "Post deleted"
    }
}

const createComment = {
    type: CommentType,
    description: "Create a new comment",
    args: {
        postId: { type: GraphQLID },
        comment: { type: GraphQLString }
    },
    resolve: async (_, { postId, comment }, { verifiedUser }) => {
        if (!verifiedUser) {
            throw new Error("You must be logged in to comment")
        }

        const newComment = await new Comment({
            postId: postId,
            comment: comment,
            userId: verifiedUser._id
        })

        return newComment.save()
    }
}

const editComment = {
    type: CommentType,
    description: "Edit a comment",
    args: {
        id: { type: GraphQLID },
        comment: { type: GraphQLString }
    },
    resolve: async (_, { id, comment }, { verifiedUser }) => {
        if (!verifiedUser) {
            throw new Error("You must be logged in to update a comment")
        }

        const updatedComment = await Comment.findOneAndUpdate(
            { _id: id, userId: verifiedUser._id },
            { comment },
            { new: true, runValidators: true }
        )

        if (!updatedComment) {
            throw new Error("You do not have permission to update this comment")
        }

        return updatedComment
    }
}

const deleteComment = {
    type: GraphQLString,
    description: "Delete a comment",
    args: {
        id: { type: GraphQLID }
    },
    resolve: async (_, { id }, { verifiedUser }) => {
        if (!verifiedUser) {
            throw new Error("You must be logged in to delete a comment")
        }

        const deletedComment = await Comment.findOneAndDelete({ _id: id, userId: verifiedUser._id })

        if (!deletedComment) {
            throw new Error("You do not have permission to delete this comment")
        }

        return "Comment deleted"
    }
}

module.exports = { register, login, createPost, editPost, deletePost, createComment, editComment, deleteComment }