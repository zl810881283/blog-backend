const fs = require('fs')
const router = require('koa-router')()

router.prefix('/api')

fs.readdirSync(__dirname).filter(i => i !='index.js').forEach(i => {
    let module = require(`./${i}`)
    router.use(module.routes())
})

module.exports = router