'use strict'

import { resErrorHandler } from 'commons/exceptions/resHandler'
import { NextFunction, Response } from 'express'
import usersRouter from 'routes/userRoutes'
const cors = require('cors')
const bodyParser = require('body-parser')

var __importDefault: any =
  (this && (this as any).__importDefault) ||
  function (mod: any) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
const dotenv_1 = __importDefault(require('dotenv'))

dotenv_1.default.config()
const app = (0, express_1.default)()
const port = process.env.PORT_BACKEND || 3001

const corsOptions = {
  credentials: true,
  origin: true
}

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(cors(corsOptions))

app.use('/users', usersRouter)

app.use(function (error: any, req: Request, res: Response, next: NextFunction) {
  return resErrorHandler(res, error)
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
