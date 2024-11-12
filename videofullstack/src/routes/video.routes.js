import express from "express"
import {uploadPost} from '../controllers/video.controller.js'
import { upload } from "../middlewares/multer.middleware.js"

const router= express.Router();

router.post(
  "/post",  // Define the route path for registration
  upload.fields([  // Use multer middleware to handle file uploads
    {
      name: "videoFile",
      maxCount: 1
    }
  ]),
  uploadPost  
);

  export default router;