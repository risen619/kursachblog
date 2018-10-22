import mongoose from "mongoose";
import debug from "debug";

const logMessage = debug("api:contollers:posts:message");
const logError = debug("api:controllers:posts:error");

const Post = mongoose.model("Post");

const all = function (req, res) {
    Post.find()
        .then(posts => {
            return res.json({
                error: false,
                posts: posts
            });
        });
}

const create = function (req, res) {
    if (!req._user || (req._user.role !== 'author' && req._user.role !== 'admin')) {
        return res.status(403)
            .json({
                error: true,
                errors: "You are not allowed to add posts"
            });
    }
    const post = new Post(req.body);
    post.save()
        .then(() => {
            return res.json({
                error: false,
                post: post
            });
        })
        .catch(err => {
            logError('Post save error: %O', err);
            return res.status(500)
                .json({
                    error: true,
                    errors: ['Internal server errror']
                });
        });
}

const update = function (req, res) {

}

const remove = function (req, res) {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404)
                    .json({
                        error: true,
                        errors: ["Post not found"]
                    });
            }
            if (req._user.role !== 'admin' && req._user._id !== post.userId) {
                return res.status(403)
                    .json({
                        error: true,
                        errors: ["You are not allowed to delete this post"]
                    })
            }
            post.remove()
                .then(() => {
                    return res.json({
                        error: false
                    });
                })
                .catch(err => {
                    logError('Post remove error: %O', err);
                    return res.status(500)
                        .json({
                            error: true,
                            errors: ['Internal server errror']
                        });
                });

        })
        .catch(err => {
            logError('Post find error: %O', err);
            return res.status(500)
                .json({
                    error: true,
                    errors: ['Internal server errror']
                });
        });
}

const load = function (req, res) {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404)
                    .json({
                        error: true,
                        errors: ["Post not found"]
                    });
            }
            return res.json({
                error: false,
                post: post
            });
        })
        .catch(err => {
            logError('Post load error: %O', err);
            return res.status(500)
                .json({
                    error: true,
                    errors: ['Internal server errror']
                });
        });
}

const addComment = function (req, res) {
    if (!req.body.text || !req.body.text.length || req.body.text.length < 10) {
        return res.status(400)
            .json({
                error: true,
                errors: ["Too short comment"]
            });
    }
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404)
                    .json({
                        error: true,
                        errors: ["Post not found"]
                    });
            }
            if (!post.comments) {
                post.comments = [];
            }
            post.comments.push({
                userId: req._user._id,
                text: req.body.text
            });
            post.save()
                .then(saved => {
                    return res.json({
                        error: false,
                        post: saved
                    });
                })
                .catch(err => {
                    logError('Post save error: %O', err);
                    return res.status(500)
                        .json({
                            error: true,
                            errors: ['Internal server errror']
                        });
                });
        })
        .catch(err => {
            logError('Post load error: %O', err);
            return res.status(500)
                .json({
                    error: true,
                    errors: ['Internal server errror']
                });
        });
}

export default {
    all,
    create,
    update,
    remove,
    load,
    addComment
}