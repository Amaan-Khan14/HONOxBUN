import { model, Schema } from "mongoose"

export interface FavVideo {
    title: string,
    description: string,
    channelName: string,
    watched: boolean,
    url: string
}

const FavVideoSchema = new Schema<FavVideo>({
    title: String,
    description: String,
    channelName: String,
    watched: {
        type: Boolean,
        default: false
    },
    url: {
        type: String,
        default: "https://youtu.be/CDUbkFBHb5A?feature=shared",
        required: false
    }
})

const favVideoModel = model('favVideo', FavVideoSchema)

export default favVideoModel