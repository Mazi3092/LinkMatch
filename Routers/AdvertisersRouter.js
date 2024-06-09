import express from "express"
import AdvertisersControllers from"../Controllers/AdvertisersControllers.js"

const AdvertisersRouter = express.Router()

AdvertisersRouter.get("/getUrlsById",AdvertisersControllers.getUrlsById)
// AdvertisersRouter.get("/all",AdvertisersControllers.getListAll)
AdvertisersRouter.get("/:id",AdvertisersControllers.getById)
AdvertisersRouter.get("/",AdvertisersControllers.getList)
AdvertisersRouter.post("/",AdvertisersControllers.add)
AdvertisersRouter.put("/addLink",AdvertisersControllers.updateLinks)
AdvertisersRouter.put("/:id",AdvertisersControllers.update)
AdvertisersRouter.delete("/:id",AdvertisersControllers.delete)
AdvertisersRouter.delete("/",AdvertisersControllers.deleteAll)

export default AdvertisersRouter

