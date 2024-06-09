import mongoose from "mongoose";
const uri = "mongodb+srv://mazi:vHFTfd5LSUSk1FlE@cluster0.m3ygxe5.mongodb.net/tinyurl?retryWrites=true&w=majority"


const connectDB= async()=>{
   await mongoose.connect(uri);
}

mongoose.connection.on("connected",()=>{
    console.log(`mongo is connect`)
})
mongoose.set('toJSON',{
    virtuals:true,
    transform:(doc,converted)=>{
        delete converted._id;

    }
}

)
export default connectDB;