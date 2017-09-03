const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')
const cors = require('koa-cors')
const index = require('./routes/index')
const users = require('./routes/users')
const apiRouter = require('./routes/api')
// error handler
onerror(app)

app.keys = ['blog'] 
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))


app.use(session({
  key: 'blog:koa:sess',
  maxAge: 86400000
}, app));

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))


// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
app.use(cors({
  credentials: true
}))
// routes
app.use(index.routes())
app.use(index.allowedMethods())

app.use(users.routes())
app.use(users.allowedMethods())

app.use(apiRouter.routes())
app.use(apiRouter.allowedMethods())

module.exports = app
