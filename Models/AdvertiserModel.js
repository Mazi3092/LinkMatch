import mongoose from 'mongoose'

const AdvertiserSchema = mongoose.Schema({
    // "id":String,
    "name":String,
    "userId":String,
    // "name":String,
    "profile":String,
    "details":{
        "about":String,
        "followerAge":String,
        "audience":String,
        "platforms":[],
    },
    "entryDate":String,
    "numLinks":Number,
    "links":[
        {
            "url":String,
            "urlId":String,
            "numClicks":Number,
        }
    ],
    "role":String,
    "numAllClicks":Number,

})
export default mongoose.model("AdvertiserModel",AdvertiserSchema)