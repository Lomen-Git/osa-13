const router = require('express').Router()

const { User } = require('../models')

router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll()
        res.json(users)
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        res.json(user)
    } catch (error) {
        next (error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id)
        if (user) {
          res.json(user)
        } else {
          res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

router.put('/:username', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { username: req.params.username }
        })
        if (user) {
            user.name = req.body.name
            await user.save()
            res.json(user)
        } else {
            res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router