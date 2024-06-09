import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
    // "id":String,
    "name":String,
    "email":String,
    "password":String,
    "profile":String,
    "links":Array,
    "role":String,
    "advertiserId":String,
    "getCollaborations":Boolean,
    "gmail":{
        "Inbox":[
            {
                "from":{
                    "id":String,
                    "name":String
                },
                "text":String,
                "date":Date,
                "called":Boolean
            }
        ],
        "Outbox":[
            {
                "to":{
                    "id":String,
                    "name":String
                },
                "text":String,
                "date":Date,
            }
        ]
    },
    "chats":[{
        "userId":String,
        "messages":[{
            "from":String,
            "fromName":String,
            "text":String,
            "time":Date,
        }]
    }

    ],
})
export default mongoose.model("UserModel",UserSchema)