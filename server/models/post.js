import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    text: {
        type: Schema.Types.String
    },
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now
    },
    updatedAt: {
        type: Schema.Types.Date,
        default: Date.now
    },
    tags: {
        type: [Schema.Types.String]
    },
    comments: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        text: {
            type: Schema.Types.String
        },
        createdAt: {
            type: Schema.Types.Date,
            default: Date.now
        }
    }]
});

mongoose.model("Post", PostSchema);