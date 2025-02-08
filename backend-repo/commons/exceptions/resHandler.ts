import ClientError from './ClientError'

export const resErrorHandler = (res: any, error: any) => {
  if (error.code === 'ECONNREFUSED') {
    console.log(error)
    return res.status(500).json({
      status: false,
      message: 'service unavailable',
      dev: error.message
    })
  }

  if (error instanceof ClientError) {
    const response = {
      success: false,
      message: error.message,
      error: error.errors
    }
    return res.status(error.statusCode || 400).json(response)
  }

  if (error.response) {
    return res.status(error.response.status).json(error.response.data)
  }

  // Server ERROR!
  console.log(error)
  console.log(error.message)
  const response = {
    success: false,
    message: 'Sorry, something went wrong on the server',
    dev: error
  }
  return res.status(500).json(response)
}

export const resSuccessHandler = (res: any, message: any, payload?: any, code = 200) => {
  const response = {
    success: true,
    payload,
    message
  }
  return res.status(code).send(response)
}
