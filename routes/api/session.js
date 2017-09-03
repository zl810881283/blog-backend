const router = require('koa-router')()
const { sequelize, User } = require('../../model')

router.prefix('/session')

router.get('/',async ctx => {
	let user = await User.findById(ctx.session.userId)
	ctx.body = {
		err: 0,
		info: null,
		data: user
	}
})

router.post('/', async ctx => {
	const { username, password } = ctx.request.body
	let user = await User.findOne({ where: { username } })

	if (!user) {
		ctx.body = {
			err: 10101,
			info: 'username not exists',
			data: null
		}
		return
	}

	if (password != user.password) {
		ctx.body = {
			err: 10102,
			info: 'password is not right',
			data: null
		}
		return
	}

	ctx.session.userId = user.id

	ctx.body = {
		err: 0,
		info: null,
		data: user
	}

})

router.delete('/',async ctx=>{
	ctx.session = null;
	ctx.body = {
		err: 0,
		info:null,
		data: null,
	}	
})
module.exports = router