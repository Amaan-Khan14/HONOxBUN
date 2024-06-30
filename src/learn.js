import { Hono } from 'hono';
import { stream, streamText, streamSSE } from 'hono/streaming';
import { v4 as uuidV4 } from "uuid";

const app = new Hono()

app.get("/", (c) => {
    return c.text("Hello Hono")
})

let videos = []

app.post('/video', async (c) => {
    const { videoName, duration } = await c.req.json()
    const newVideo = {
        id: uuidV4(),
        videoName,
        duration
    }
    videos.push(newVideo)
    return c.json(newVideo)
})

app.get('/videos', (c) => {
    return streamText(c, async (stream) => {
        for (const video of videos) {
            await stream.writeln(JSON.stringify(video))
        }
    })
})

app.get('/video/:id', (c) => {

    const { id } = c.req.param()
    const video = videos.find((video) => video.id == id)
    if (!video) {
        return c.json({ message: "Video Not found" })
    }
    return c.json(video)
})

app.put("/video/:id", async (c) => {
    const { id } = c.req.param()
    const index = videos.findIndex((video) => video.id == id)
    if (index == -1) {
        return c.json({ message: "Video Not found" })
    }
    const { videoName, duration } = await c.req.json()
    videos[index] = { ...videos[index], videoName, duration }
    return c.json(videos[index])
})

app.delete("/video/:id", (c) => {
    const { id } = c.req.param()
    videos = videos.filter((video) => video.id != id)
    return c.json({ message: "Video Deleted Successfully" })
})

export default app