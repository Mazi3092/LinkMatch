import mongoose from 'mongoose';

const LinkSchema=mongoose.Schema({
   "originalUrl":String,
   "uniqueName":String,
   "clicks":[
    {
        "id":Number,
        "insertedAt":Date,
        "ipAddress":String,
        "targetParamValue":String,
        "country":String,
        "city":String,
        "region":String,
        "timezone":String,
    }
   ],
   "targetParamName":String,
   "targetValues":[
    {
      "name":String,
      "value":String,
      "numClicks":Number,
      "idAdvertiser":String
    }
   ],
   "files":[
   {
    "nameFile":String,
    "fileUrl":String,
    "time":Date
  }

   ]
  //  "g":Image

   

   
})

export default mongoose.model('LinkModel',LinkSchema);