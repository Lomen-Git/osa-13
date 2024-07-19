const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.message === 'Validation error: Validation isEmail on username failed') {
      return response.status(400).send({ error: error.message })
    } else if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }

  module.exports = { errorHandler }