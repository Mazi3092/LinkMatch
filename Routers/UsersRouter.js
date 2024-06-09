import express from "express"
import UserControllers from"../Controllers/UserControllers.js"

const UsersRouter = express.Router()

UsersRouter.get("/chats",UserControllers.getChats)
UsersRouter.get("/collaborations",UserControllers.getCollaborations)
UsersRouter.put("/collaborations",UserControllers.updateCollaborations)
UsersRouter.put("/chat",UserControllers.sendInChat)
UsersRouter.get("/mailbox",UserControllers.getMailbox)
UsersRouter.put("/mailbox",UserControllers.updateCalled)
UsersRouter.put("/sendMessage",UserControllers.sendMessage)
UsersRouter.put("/check",UserControllers.check)
// UsersRouter.get("/urls/:id",UserControllers.getUrlsById)
UsersRouter.get("/urls/",UserControllers.getUrlsById)
UsersRouter.put("/urls/",UserControllers.deleteAllUrlsUser)
UsersRouter.get("/one",UserControllers.getOne)
UsersRouter.get("/getOneChats",UserControllers.getOneChats)
UsersRouter.get("/:id",UserControllers.getById)
UsersRouter.get("/",UserControllers.getList)
UsersRouter.post("/setProfile",UserControllers.setProfile)
UsersRouter.post("/",UserControllers.add)
UsersRouter.put("/:id",UserControllers.update)
UsersRouter.put("/",UserControllers.updateUserLinks)
UsersRouter.delete("/:id",UserControllers.delete)
UsersRouter.delete("/",UserControllers.deleteAll)

export default UsersRouter
