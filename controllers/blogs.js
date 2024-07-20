// Reittien käsittely
const router = require('express').Router()
const { Blog, User } = require('../models/index')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Op } = require('sequelize')

// MW vai funktio?
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  console.log(`taala ollaan ja auth on muuten: ${authorization}`)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(`Ollaanko täälä: (token: ${authorization.substring(7)}`)
      // Tarkastetaan token
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}


router.get('/', async (req, res, next) => {
    try {
        const blogs = await Blog.findAll({
          order: [
            ['likes', 'DESC'],
          ],
          where: {
            [Op.or]: {
              title: {
                [Op.substring]: req.query.search ? req.query.search : ''
              },
              author: {
                [Op.substring]: req.query.search ? req.query.search : ''
              }
            }
          }
        })
        res.json(blogs)
    } catch (error) {
        next(error)
    }
})

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({...req.body, userId: user.id })
        return res.json(blog)
    } catch (error) {
        next(error)
    }
})

router.get(':id', async (req, res, next) => {
    try {
        const blog = await Blog.findByPk(req.params.id)
        if (blog) {
            res.json(blog)
        } else {
            res.status(404).end()
        }
    } catch (error) {
        next (error)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id)
        if (blog) {
          blog.likes = req.body.likes
          await blog.save()
          res.json(blog)
        } else {
          res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
  })

router.delete('/:id', tokenExtractor, async (req, res, next) => {
    try {
      const user = await User.findByPk(req.decodedToken.id)
      const blog = await Blog.findByPk(req.params.id)

        if (blog && (blog.userId === user.id)) {
            await blog.destroy();
            return res.status(204).end()
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router