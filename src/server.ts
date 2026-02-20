import { app } from './app'
import { env } from './env'

app
  .listen({
    host: env.HOST,
    port: env.PORT,
  })
  .then(() => {
    const url = `http://localhost:${env.PORT}`
    console.log(`HTTP Server Running at ${url}`)
  })
