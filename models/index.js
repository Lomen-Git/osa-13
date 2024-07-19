// Kun useampia tauluja -> tuodaan tänne -> muualla ohjelmassa importataan vain tämä
const Blog = require('./blog')

const User = require('./user')

Blog.sync()

User.sync()

module.exports = {

  Blog, User
}