const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const router = require('koa-router')()
const { sequelize, Article, Tag, User } = require('../../model')

const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

router.prefix('/article')

router.get('/', async ctx => {
    let { sort = [], offset = 0, pageSize = 10, filter = {} } = ctx.request.query
    offset = +offset
    pageSize = +pageSize
    if (typeof sort == 'string')
        sort = JSON.parse(sort)
    if (typeof filter == 'string')
        filter = JSON.parse(filter)
    let articles = await Article.findAll({
        order: sort.length == 0 ? null : [sort],
        offset: offset,
        limit: pageSize,
        where: filter,
        include: [{ model: Tag },{ model: User, attributes: {exclude: ['password']}}]
    })
    let total = await Article.count()

    let nextOffset = (offset + pageSize >= total) ? null : offset + pageSize
    ctx.body = {
        err: 0,
        info: null,
        pagination: {
            count: articles.length,
            total,
            offset: offset,
            nextOffset,
            pageSize: pageSize
        },
        data: articles.map(i => {
            i.content = DOMPurify.sanitize(i.content)
            return i
        })
    }
})
router.get('/tag/:id', async ctx => {
    let { id } = ctx.params
    let { sort = [], offset = 0, pageSize = 10, filter = {} } = ctx.request.query
    offset = +offset
    pageSize = +pageSize
    if (typeof sort == 'string')
        sort = JSON.parse(sort)
    if (typeof filter == 'string')
        filter = JSON.parse(filter)

    let tag = await Tag.find({ where: { id } })
    if (!tag) {
        ctx.body = {
            err: 10003,
            info: 'tag not exists',
            data: null
        }
        return
    }

    // TODO: 这里的查询标签下全部文章数目可以优化
    const total = (await tag.getArticles()).length

    let nextOffset = (offset + pageSize >= total) ? null : offset + pageSize
    let articles = await tag.getArticles({
        order: sort.length == 0 ? null : [sort],
        offset: offset,
        limit: pageSize,
        where: filter,
        include: [{ model: Tag }]
    })


    ctx.body = {
        err: 0,
        info: null,
        pagination: {
            count: articles.length,
            total,
            offset: offset,
            nextOffset,
            pageSize: pageSize
        },
        data: articles
    }
})
router.get('/:id', async ctx => {
    let article = await Article.findOne({ where: { id: ctx.params.id }, include: [{ model: Tag }] })

    if (article) {
        article.clickTimes++;
        await article.save()
        article.content = DOMPurify.sanitize(article.content)
        ctx.body = {
            err: 0,
            info: null,
            data: article
        }
    }
    else
        ctx.body = {
            err: 10001,
            info: "article id is not found",
            data: null
        }
})
router.post('/', async ctx => {
    console.log(typeof ctx.request.body)
    let { title, target, content } = ctx.request.body
    let { userId } = ctx.session
    let article = await Article.create({ title, target, content, userId })
    ctx.body = {
        err: 0,
        info: null,
        data: article
    }
})
router.put('/:id', async ctx => {
    let article = await Article.findOne({ where: { id: ctx.params.id } })

    if (article) {
        let { title, content, target } = ctx.request.body
        article.title = title
        article.content = content
        article.target = target
        await article.save()
        ctx.body = {
            err: 0,
            info: null,
            data: article
        }

    } else {
        ctx.body = {
            err: 10001,
            info: "article id is not found",
            data: null
        }
    }
})

router.delete('/:id', async ctx => {
    let article = await Article.findOne({ where: { id: ctx.params.id } })
    if (article) {
        await article.destroy()
    }

    ctx.body = {
        err: 0,
        info: null,
    }
})

module.exports = router