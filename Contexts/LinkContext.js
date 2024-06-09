import LinkModel from "../Models/LinkModel.js"
import UserModel from "../Models/UserModel.js";

const LinkContext = {
    getAllLinks: async()=>{
        // console.log('get all links')
        let linksList = await LinkModel.find()
        return linksList;
    }, 
    getLinkById: async(id)=>{
        console.log('get link by id')
        const link = await LinkModel.findById(id)
        return link;
    },
    getLinkByUniqueName: async(uniqueName)=>{
        console.log('get link by uniqueName')
        const link = await LinkModel.findOne({"uniqueName":uniqueName}) 
        return link;
    },
    addLink: async({uniqueName,originalUrl,userId})=>{
        console.log('add link')
        try{
        const link = await LinkModel.findOne({"uniqueName":uniqueName})
        if(link){
            console.log('שם תפוס')
            return false
        } 
        else{
            let added = new LinkModel({originalUrl,uniqueName})
        added.save()
        const u = await UserModel.findById(userId)
        const links = u.links || []
        links.push(added.id)
        u.save()
        const now = await UserModel.findById(userId)
        return added
        }
        }
        catch{
           console.log("no found id")
           return
        }
    },
    updateLink: async(id,link)=>{
        console.log('update link')
        let updated = await LinkModel.findByIdAndUpdate(id,link,{new:true})
        updated.save()
        return updated
    },
    deleteLink: async(id)=>{
        console.log('delete one Link')
        let deleted = await LinkModel.findByIdAndDelete(id)
        return deleted
    },
    deleteAllLinks: async()=>{
        console.log('delete all links')
        let deleted = await LinkModel.find().deleteMany()
        return deleted
    },
    redirect: async(uniqueName)=>{
        console.log('redirect')
        let originalUrl = await LinkModel.findOne({"uniqueName":uniqueName}) 
        return originalUrl
    },
   getTarget:async (urlId) => {
    console.log('getTarget');
    console.log(urlId);
    try {
        const res = await LinkContext.getAllLinks();
        for (const r of res) {
            const ind = r.targetValues.findIndex(i => i.id == urlId);
            if (ind != -1) {
                const t = r.targetValues[ind];
                return t;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return null;  // במקרה שלא נמצא הערך, הפונקציה תחזיר null
}




}
export default LinkContext