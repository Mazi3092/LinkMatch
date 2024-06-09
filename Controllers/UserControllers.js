// import { json } from "body-parser";
import axios from "axios";
import UserContext from "../Contexts/UserContext.js"
import LinkModel from "../Models/LinkModel.js";
import UserModel from "../Models/UserModel.js";
import nodemailer from 'nodemailer';

// import Send from '../mail.js'
import LinkContext from "../Contexts/LinkContext.js";
import AdvertiserContext from "../Contexts/AdvertiserContext.js";
import multer from "multer";
import path from "path"
import fs from "fs"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'uploads/';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });
  
const UsesrControllers = {
    deleteAllAll: async(req,res)=>{
        console.log('1')
        let delList = await UserContext.deleteAllUsers();
        console.log('2')
        let del = await LinkContext.deleteAllLinks();
        console.log('3')
        let deli = await AdvertiserContext.deleteAllAdvertisers();
        console.log('4')
        console.log(delList + del + deli)

        res.send('delList')
    },
    getById:async(req,res)=>{
        let user = await UserContext.getUserById(req.params.id)
        res.send(user)
    },
    getOne:async(req,res)=>{
        const id = req.id
        let user = await UserContext.getUserById(id)
        res.send(user)
    },
    getOneChats:async(req,res)=>{
        const id = req.id
        let user = await UserContext.getUserById(id)
        let chats = user.chats
        let i = 0, arr =[]
        // console.log(chats)
        for (const c of chats) {
        // chats.forEach(async(c) =>{
            let partner = await UserContext.getUserById(c.userId)
            console.log('partner:')
            console.log(partner)
            let partnerName = partner.name
            let partnerProfile = partner.profile
            arr[i] = { userId: c.userId,messages: c.messages,_id: c._id,partnerName:partnerName,partnerProfile:partnerProfile}
            // console.log('arr['+i+']:',arr[i])
            // arr.save()
            if(i==chats.length-1){
                console.log('chats:',arr)
                res.send(arr)
            }
            i++
        }
    // )
        
    },
    getChats:async(req,res)=>{
        const id = req.id
        let user = await UserContext.getUserById(id)
        let chats = user.chats
        let i = 0, arr =[]
        chats.forEach(async(c) =>{
            let partner = await UserContext.getUserById(c.userId)
            let partnerName = partner.name
            let partnerProfile = partner.profile
            arr[i] = { userId: c.userId,messages: c.messages,_id: c._id,partnerName:partnerName,partnerProfile:partnerProfile}
            console.log('arr['+i+']:',arr[i])
            // arr.save()
            if(i==chats.length-1){
                console.log('chats:',arr)
                res.send(arr)
            }
            i++
        })
        
    },
    getList:async(req,res)=>{
        let userList = await UserContext.getAllUsers()
        res.send(userList)
    },
    getCollaborations:async(req,res)=>{
        const id = req.id
        let me = await UserContext.getUserById(id)
        let userList = await UserContext.getUsersAgree()
        const setA = new Set(me.chats.map(chat => chat.userId));
        const setB = new Set(userList.map(user => user.id));
        // const filteredArrayA = me.chats.filter(chat => !setB.has(chat.userId));
        const filteredArrayB = userList.filter(user => !setA.has(user.id));
        let arr=[],i=0
        for (const o of me.chats) {
            let u = await UserContext.getUserById(o.userId);
            arr.push({ profile: u.profile, name: u.name, email: u.email, id: u.id, messages: o.messages });
          }
        filteredArrayB.forEach(async(u)=>{
            arr.push({profile:u.profile,name:u.name,email:u.email,id:u.id,messages:[]})
            i++
        })
        // console.log(arr)
        res.send(arr)
    },
    updateCollaborations:async(req,res)=>{
        let id = req.id
        let user = await UserContext.getUserById(id)
        console.log('befor:'+user.getCollaborations)
        user.getCollaborations=!user.getCollaborations
        let updated = await UserContext.updateUser(id,user)
        console.log('updated:'+updated.getCollaborations)
        res.send(updated.getCollaborations)
    },
    add:async(req,res)=>{
        const {name,email,password} = req.body;
        let getCollaborations = req.body.getCollaborations
        console.log('getCollaborations:'+getCollaborations)
        let {profile} = req.body
        if(getCollaborations==null){
            getCollaborations=true
        }
        if(!profile)
            {
                profile='https://i.pinimg.com/564x/85/79/da/8579da2ff271bd658135b34873a30344.jpg'
            }
        let role = ''
        if(name=='mazi' && password=='0534113092')
            {
                role = 'manager'
            }
            else
            {
                role = 'user'
            }
        let added = await UserContext.addUser({name,email,password,profile,role,getCollaborations});
        console.log(added.id)
        if(added)
        {
            console.log('entered succesfull')
            const token = await UserContext.checkUser({email,password})
            // UsesrControllers.sendMail(added.email)
            res.send(token)
        }
        else{
            console.log('This email is already registered in the system')
            res.send('This email is already registered in the system')
        }
    },
    update:async(req,res)=>{
       const {id} = req.params
       const user = req.body
       let updated = await UserContext.updateUser(id,user);
       res.send(updated)
    },
    updateUserLinks:async(req,res)=>{
        const{userId,linkId} = req.body
        console.log('userId: ' + userId + ' linkId: ' + linkId)
        let updateUser = await UserContext.getUserById(userId)
        let ind = updateUser.links.findIndex(l=>l==linkId)
        updateUser.links.splice(ind,1)
        updateUser.save()
        let updated = await UserContext.updateUser(userId,updateUser)
        let deletedLink = await LinkContext.deleteLink(linkId)
        res.send(updated)
    },
    delete: async(req,res)=>{
        let user = await UserContext.getUserById(req.params.id)
        user.links.forEach(async(id) =>{
         let del = await LinkContext.deleteLink(id);
       }
        )
        let del = await UserContext.deleteUser(req.params.id);
        res.send(del)
    },
    deleteAllUrlsUser: async(req,res)=>{
        const userId = req.id
        console.log(userId)
        let user = await UserContext.getUserById(req.id)
        user.links.forEach(async(id) =>{
         let del = await LinkContext.deleteLink(id);
       }
        )
       user.links = []
       user.save();

        let updated = await UserContext.updateUser(userId,user);


        res.send(updated)
    },
    deleteAll: async(req,res)=>{  
        let delUsersList = await UserContext.deleteAllUsers();
        let delLinksList = await LinkContext.deleteAllLinks();
        let deladvertisersList = await AdvertiserContext.deleteAllAdvertisers();
        res.send(delUsersList)
    },
    Authorization:async(req,res)=>{
        const {name,password}= req.body
        console.log(name)
        console.log(password)
        // const userExsist = await UserModel.findOne({"name":name,"password":password})
        // if(userExsist)
        // res.send(userExsist)
        // else
        // res.send('not exists')
    },
    getUrlsById: async(req,res)=>{
        const id = req.id
        let userUrls= await UserContext.getUserById(id)
        let arr = []
            let i=0
            let link
            if(userUrls.links)
                {
                    userUrls.links.forEach(async(id) =>{
                        link = await LinkModel.findById(id)
                        arr[i] = link
                        arr[i].save()
                        // arr[i].id = link.id
                        i++
                        if(i==userUrls.links.length){
                            res.send(arr)
                        }
                    })

                }
                else{
                res.send(arr) 
                }
    },
    check:async(req,res)=>{
        const{email,password} = req.body;
        console.log(email + ' ' + password)
        let token = await UserContext.checkUser({email,password})
        console.log('token:' + token.token)
        res.send(token)
        },
    ipp:async(req,res)=>{
        const ipAddress = '147.234.64.79';
        const apiUrl = `https://ipapi.co/${ipAddress}/json/`
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json()
            console.log(data.ip)
            console.log(data.country_name)
            console.log(data.city)
            console.log(data.region)
            console.log(data.timezone)
        }
            },
    sendMessage:async(req,res)=>{
        // const from = '664b30a31997cabf0f9d18a9'
        // const from = req.body.userId
        const from = req.id
        const{to,text}=req.body;
       if(to==from)
        {
            res.send('בטעות שלחת הודעה לעצמך 👎')
        }
        else{
            const date = Date.now()
            console.log('from: ' + from + ' ' + ' text: ' + text + ' ' + ' date: ' + date + ' to: ' + to)
            let updateUserFrom = await UserContext.getUserById(from)
            let updateUserTo = await UserContext.getUserById(to)
            // console.log(updateUserTo)
            let g = {'text':text,'date':date,'to':{'id':to,'name':updateUserTo.name}}
            let y =[]
            y =  [...updateUserFrom.gmail.Outbox,g]
            updateUserFrom.gmail.Outbox = y
            let updated = await UserContext.updateUser(from,updateUserFrom)
            g = {'from':{'id':from,'name':updateUserFrom.name},'text':text,'date':date}
            y =  [...updateUserTo.gmail.Inbox,g]
            updateUserTo.gmail.Inbox = y
            updated = await UserContext.updateUser(to,updateUserTo)
            res.send('ההודעה נשלחה בהצלחה 👍')
        }
       },
       getMailbox:async(req,res)=>{
        const id = req.id
        let user = await UserContext.getUserById(id)
        try{
            // console.log(user.gmail)
            res.send(user.gmail)
        }
        catch (error) {
            // console.error('error');
            res.status(500).send({ message: 'cant user.gmail' });
        }
      },
      updateCalled:async(req,res)=>{
        // let users = await UserContext.getAllUsers()
        // users.forEach(async(u)=>{
        //     u.gmail.Inbox.forEach(i=>{
        //         i.called=false
        //     })
        //     await UserContext.updateUser(u.id,u)
        // })
        const{inboxId} = req.body
        const id = req.id
        let user = await UserContext.getUserById(id)
        let ind = await user.gmail.Inbox.findIndex(i=>i.id==inboxId)
        user.gmail.Inbox[ind].called=true
        await UserContext.updateUser(id,user)

      },

    sendMail: async (mail,req, res) => {
    try {
        console.log(mail)
        // יצירת טרנספורטר של Nodemailer
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'tinyurl092@gmail.com',
                pass: 'gyya iavs enhf xjnj'
            }
        });

        // הגדרת אפשרויות המייל
        let mailOptions = {
            from: 'tinyurl092@gmail.com',
            // to: 'ba5706988@gmail.com',
            to: mail,
            subject: 'תודה שנרשמת לאתר TinyUrl!',
            text: 'This is a test email sent from Node.js using Gmail'
        };

        // שליחת המייל
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send({ message: 'Error sending email', error });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send({ message: 'Email sent successfully', info });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
},
  setProfile:(req, res) => {
    console.log('1')
    upload.single('profilePicture')(req, res, async (err) => {
      if (err) {
        console.log('2')
        return res.status(500).send({ message: 'Error uploading file' });
      }
      try {
        const id = req.id;
        let fileUrl
        if (!req.file) {
        console.log('4')
        fileUrl = '';
        //   return res.status(400).send({ message: 'No file uploaded' });
        }
        else{
            fileUrl = `http://localhost:9000/uploads/${req.file.filename}`;
        }
        console.log(fileUrl);
        console.log('5')
        let user = await UserContext.getUserById(id);
        user.profile = fileUrl;
        await user.save();
        let updated = await UserContext.updateUser(id, user);
        console.log(updated);
        res.send({ message: 'Profile updated successfully', fileUrl });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error updating profile' });
      }
    });
  },
  sendInChat:async(req,res)=>{
    const id = req.id
    console.log('id:' + id)
    const{text,userId} = req.body
    console.log('text + userId:' + text + userId)
    // const time = Date.now()
    const time = new Date(2024, 5, 29, 14, 30);
    console.log('time:' + time)
    const userFrom = await UserContext.getUserById(id)
    const message = {"from":id,"text":text,"time":time,"fromName":userFrom.name}
    console.log('userFrom.chats:' + userFrom.chats)
    let chatsArr = userFrom.chats || []
    console.log(chatsArr)
    let chatArr = await userFrom.chats.findIndex(c=>c.userId==userId)
    if(chatsArr.length==0||chatArr==-1)
        {
            chatsArr.push({userId:userId,messages:message})
            // chatsArr.save()
            userFrom.chats = chatsArr
            userFrom.save()
            console.log('pol')
            console.log(userFrom)
            await UserContext.updateUser(id,userFrom)   
        }
        else{
            console.log(chatArr)
                console.log('message:')
                // console.log( message)
                chatsArr[chatArr].messages.push(message)
                userFrom.chats=chatsArr
            //     userFrom.save()
            await UserContext.updateUser(id,userFrom)   
            }
    const userTo = await UserContext.getUserById(userId)
    console.log('userT o.chats:' + userTo.chats)
    let chatsArrTo = userTo.chats || []
    console.log(chatsArrTo)
    let chatArrTo = await userTo.chats.findIndex(c=>c.userId==id)
    if(chatsArrTo.length==0||chatArrTo==-1)
        {
            chatsArrTo.push({userId:id,messages:message})
            userTo.chats=chatsArrTo
            userTo.save()
            console.log('pol')
            await UserContext.updateUser(userId,userTo)   
        }
        else{
                console.log('message:')
                // console.log( message)
                chatsArrTo[chatArrTo].messages.push(message)
                // userTo.chats=chatsArrTo
                await UserContext.updateUser(userId,userTo)   
                res.send('ff')
        }
  }
      }

export default UsesrControllers