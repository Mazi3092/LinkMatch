import express from 'express';
import LinksControllers from "../Controllers/LinksControllers.js";
import multer from 'multer';

const LinksRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

LinksRouter.put("/AddTarget", LinksControllers.addTargetValue);
LinksRouter.get("/", LinksControllers.getList);
LinksRouter.get("/:id", LinksControllers.getById);
LinksRouter.post("/addFile", upload.single('file'), LinksControllers.updateFilesLink); // Updated line
LinksRouter.post("/", LinksControllers.add);
LinksRouter.put("/:id", LinksControllers.update);
LinksRouter.delete("/:id", LinksControllers.delete);
LinksRouter.delete("/", LinksControllers.deleteAll);

export default LinksRouter;
