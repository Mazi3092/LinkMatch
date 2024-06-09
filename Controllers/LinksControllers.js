import AdvertiserContext from '../Contexts/AdvertiserContext.js';
import LinkContext from '../Contexts/LinkContext.js'
import UserContext from '../Contexts/UserContext.js';
import ip from 'ip'
import multer from "multer";
import path from "path";
import fs from "fs";

const LinksControllers = {
    getList: async(req,res) =>{
        let Linkslist = await LinkContext.getAllLinks();
        res.send(Linkslist)     
    },
    getById: async(req,res) =>{
        const link = await LinkContext.getLinkById(req.params.id);
        res.send(link)          
    },
    add: async(req,res)=>{
        const {uniqueName,originalUrl}=req.body
        const userId = req.id
        console.log('url:' + userId + ' ' + uniqueName + ' ' + originalUrl)
        const added = await LinkContext.addLink({uniqueName,originalUrl,userId});
        if(added)
            {
               res.send('http://localhost:9000/u/'+ added.uniqueName)     
            }
            else{
               res.status(500).send('שם לא זמין בחר שם אחר');
            }
    },
    update: async(req,res)=>{
        const id = req.params.id
        const link = req.body
        console.log(id)
        console.log(link)
        let updated = await LinkContext.updateLink(id,link,{new:true});
        res.send(updated)        
    },
    addFiles: async(req,res)=>{
        const id = req.id
        const link = req.body
        console.log(id)
        console.log(link)
        let updateLink = await LinkContext.getLinkById('6652dde0b3178992401a93bd');
        updateLink.files.push('')
        let updated = await LinkContext.updateLink(id,link,{new:true});
        res.send(updated)        
    },
    delete: async(req,res)=>{
    const id = req.id
    let user = await UserContext.getUserById(id);
    let links = user.links
    console.log('ll',links)
    // console.log('lplp'+links[0])
    const u = links.findIndex(a=>a==req.params.id)
    user.links.splice(u ,1) ||[]
    user.save()
    // user.links = links
    // console.log(u)
    // user.save()
    console.log('lttl',user)
    let del = await LinkContext.deleteLink(req.params.id);
    res.send("del")
    },
    deleteAll: async(req,res)=>{
        let del = await LinkContext.deleteAllLinks();
        res.send(del)
    },
    updateTargetValue:(req,res)=>{
         // const ipAddress = '147.234.74.41'
        // const ipAddress = '147.234.104.71'

    },
    redirect: async(req, res) => {
        const { uniqueName } = req.params;
        const from = req.query.t;
        console.log('uniqueName: ' + uniqueName + ' from: ' + from);
        try {
            const link = await LinkContext.redirect(uniqueName);
            if (!link) {
                return res.status(404).send('Link not found');
            }
            const clicks = link.clicks || [];
            const ipAddress = '147.234.34.71'; // דוגמת כתובת IP לצורך חיפוש מיקום גאוגרפי
            console.log(req.socket.localAddress);
            const apiUrl = `https://ipapi.co/${ipAddress}/json/`;
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                clicks.push({
                    insertedAt: Date.now(),
                    ipAddress: data.ip,
                    targetParamValue: from,
                    country: data.country_name,
                    city: data.city,
                    region: data.region,
                    timezone: data.timezone
                });
                link.clicks = clicks;
                await link.save();
                console.log('Link updated with new click:', link);
                let ind = link.targetValues.findIndex(c => c.value === from);
                if (ind === -1) {
                    // הוספת ערך חדש אם לא נמצא ערך מתאים
                    link.targetValues.push({ value: from, numClicks: 1 });
                } else {
                    console.log(link.targetValues[ind]);
                    if (link.targetValues[ind].numClicks) {
                        link.targetValues[ind].numClicks++;
                    } else {
                        link.targetValues[ind].numClicks = 1;
                    }
                }
                await LinkContext.updateLink(link.id, link);
                console.log(ind);
            } else {
                console.error('Failed to fetch geolocation data:', response.statusText);
            }
            res.redirect(link.originalUrl);
        } catch (error) {
            console.error('Error processing click event:', error);
            res.status(500).send('Internal Server Error');
        }
    },    
    addTargetValue:async(req,res)=>{
        const userId = req.id
        const {id,newname,newvalue,idLink} = req.body  
        console.log('idLink:' + idLink)
        let url = await LinkContext.getLinkById(idLink);
        const uniqueName = url.uniqueName
        let index=url.targetValues.findIndex(t=>t.value==newvalue)
        if(index!=-1)
            {
                res.status(500).send('This value already exists Choose another value');
            }
            else{
                url.targetValues=[...url.targetValues,{name:newname,value:newvalue,idAdvertiser:id}]
        const idMew = url.targetValues[url.targetValues.length-1]._id
        url.save()
        console.log(url)
        console.log('i:' + idMew)
        if(id){
            const advertiser = await AdvertiserContext.getAdvertiserById(id)
            console.log(advertiser)
            advertiser.links.push({url:"http://localhost:9000/u/"+uniqueName+"?t="+newvalue,urlId:idMew,numClicks:0})
            advertiser.save()
            console.log('advertiser:' + advertiser)
        }else{
            'no advertiser'
        }
        res.send("http://localhost:9000/u/"+uniqueName+"?t="+newvalue);
            }
    },
   updateFilesLink:async (req, res) => {
    try {
        if (!req.file) {
          return res.status(400).send('No file uploaded');
        }
        const {linkId,nameFile} = req.body
        console.log('linkId:', linkId + '+' + nameFile)
        let link = await LinkContext.getLinkById(linkId)
        console.log(req.file)
        const fileUrl = `http://localhost:9000/uploads/${req.file.filename}`;
        console.log('link')
        console.log(fileUrl)
        const time = Date.now()
        link.files.push({nameFile,fileUrl,time})
        await LinkContext.updateLink(linkId,link)
        res.status(200).json({ message: 'File Uploaded Successfully', fileUrl });
      } catch (err) {
        console.error('err');
        res.status(500).send('Error uploading file');
      }
}

}
export default LinksControllers;



