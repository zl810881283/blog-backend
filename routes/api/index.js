const fs = require('fs')
const router = require('koa-router')()
const User = require('../../model/user')
const Permission = require('../../model/permission')

router.prefix('/api')

// router.use(async (ctx, next) => {
//     const { method, url } = ctx.request

//     const userId = ctx.session.userId || 1
//     let user = await User.findById(userId)
//     let permissions = await user.getPermissions()
//     console.log(permissions)
//     if (permissions.some(i => i.method == method && new RegExp(i.path).test(url))) {
//         await next()
//     } else {
//         ctx.body = {
//             err: 1,
//             info: 'no permission',
//             data: null
//         }
//     }


// })
fs.readdirSync(__dirname).filter(i => i != 'index.js').forEach(i => {
    let module = require(`./${i}`)
    router.use(module.routes())
})

module.exports = router