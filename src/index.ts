import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import { logger } from 'hono/logger'
import connectDb from './db/connect'
import favVideoModel from './db/favVideoModel'

const app = new Hono()

app.use(poweredBy())
app.use(logger())

app.onError((err, c) => {
  return c.text(`App Error ${err}`)
})

connectDb()
  .then(() => {

    //get all videos
    app.get('/videos', async (c) => {
      const videos = await favVideoModel.find()
      return c.json(videos)
    })

    //get video by ID
    app.get("/v/:id", async (c) => {
      const { id } = c.req.param()
      try {
        const video = await favVideoModel.findById(
          id
        )
        return c.json(video)
      } catch (error) {
        return c.json({ message: "Error" })
      }
    })

    //creating favVideo
    app.post('/video', async (c) => {
      const formData = await c.req.json()
      // if (!formData.url) delete formData.url

      try {
        const video = await favVideoModel.create(
          formData
        )
        return c.json(video)
      } catch (error) {
        return c.json({ message: "Error" })
      }
    })

    //update
    app.put("/v/:id", async (c) => {
      const { id } = c.req.param()
      const formData = await c.req.json()
      if (!formData.url) delete formData.url
      try {
        const video = await favVideoModel.findById(
          id
        )
        if (!video) return c.json({ message: "No such details Found" })
        const updatedVideo = await favVideoModel.findByIdAndUpdate(
          id,
          formData
        )
        const video1 = await favVideoModel.findById(
          id
        )
        return c.json(updatedVideo)
      } catch (error) {
        return c.json({ message: "No such details found" })
      }
    })

    //delete
    app.delete("/v/:id", async (c) => {
      const { id } = c.req.param()
      try {
        const video = await favVideoModel.findByIdAndDelete(
          id
        )
        if (!video) return c.json({ message: "Not Found" })
        return c.json({ message: "Entry Deleted" })
      } catch (error) {
        return c.json({ message: "Not Found" })
      }
    })
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
