import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import { logger } from 'hono/logger'
import connectDb from './db/connect'

const app = new Hono()

app.use(poweredBy())
app.use(logger())

app.onError((err, c) => {
  return c.text(`App Error ${err}`)
})

connectDb()
  .then(() => {

  })
  .catch((error) => {
    app.get('/*', (c) => {
      return c.json({ message: `Failed to connect mongodb ${error}` })
    })
  })

app.get('/', (c) => {
  return c.text('Hello Hono!')
})



export default app
