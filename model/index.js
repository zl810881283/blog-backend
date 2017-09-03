const User = require('./user')
const Article = require('./article')
const Tag = require('./tag')
const Tagging =require('./tagging')
const {Sequelize, sequelize} = require('./base')

User.hasMany(Article)
Article.belongsTo(User)

Article.belongsToMany(Tag,{through:Tagging})
Tag.belongsToMany(Article,{through:Tagging})

User.sync()
Tagging.sync()
Article.sync()
Tag.sync()

module.exports = {
  User,
  Article,
  Tag,
  Tagging,
  Sequelize,
  sequelize
}