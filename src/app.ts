import fastify from 'fastify'
import cors from '@fastify/cors'
import { usersRoutes } from './routes/users.routes'
import { postsRoutes } from './routes/posts.routes'

export const app = fastify({
  logger: true,
})

app.register(cors, {
  origin: true,
})

app.register(usersRoutes)
app.register(postsRoutes)
