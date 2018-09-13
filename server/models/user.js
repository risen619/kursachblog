import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
    login: {
        type: Schema.Types.String,
        minlength: 3,
        maxlength: 24,
        required: true
    },
    email: {
        type: Schema.Types.String,
        minlength: 3,
        maxlength: 50,
        required: true 
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: true
    },
    role: {
        type: Schema.Types.String,
        enum: ['admin', 'author', 'user'],
        required: true
    },
    token: {
        type: Schema.Types.String
    }
});

mongoose.model("User", UserSchema);