var mongoose = require('mongoose');

var feedSchema = new mongoose.Schema({
    title: String,
    link: String,
    rsslink: String,
    category: String
});

mongoose.model('Feed', feedSchema);