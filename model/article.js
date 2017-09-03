const {Sequelize, sequelize} = require('./base')

const User = require('./user')
const Tag = require('./tag')
const Tagging = require('./tagging')

let Article = sequelize.define("article",{
    id:{
        primaryKey: true,
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    title:{
        type:Sequelize.STRING,
        allowNull:false
    },
    clickTimes:{
        type:Sequelize.STRING,
        defaultValue: 0
    },
    content:{
        type: Sequelize.TEXT
    }
})


module.exports = Article

