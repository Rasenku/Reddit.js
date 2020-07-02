const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    createdAt: {type: Date},
    updatedAt: {type: Date},
    password: {type: String, select: false},
    username: {type: String, required: true},
    posts: [{type: Schema.Types.ObjectId, ref: "Post"}]
});

userSchema.pre('save', function(next) {
    const now = new Date()
    this.updatedAt = now
    if (!this.createdAt) {
        this.createdAt = now
    }

    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch)
    });
};

module.exports = mongoose.model('User', userSchema)
