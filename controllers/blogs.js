// Reittien käsittely
const router = require('express').Router()
const { Blog } = require('../models/index')


router.get('/', async (req, res, next) => {
    console.log('hep')
    try {
        const blogs = await Blog.findAll()
        console.log(`blogs on: ${blogs}`)
        res.json(blogs)
    } catch (error) {
        next(error)
    }   
})

router.post('/', async (req, res, next) => {
    try {
      const blog = await Blog.create(req.body)
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

router.delete('/:id', async (req, res, next) => {
    try {
        const blog = await Blog.findByPk(req.params.id)
        if (blog) {
            await blog.destroy();
            return res.status(204).end()
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router