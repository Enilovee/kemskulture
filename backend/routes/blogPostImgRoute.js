import path from 'path';
import express from 'express';
import multer from 'multer';
import blogCloudinary from '../config/blogCloudinary.js';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetypes = /image\/jpeg|image\/jpg|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

const upload = multer({ storage, fileFilter });
 

router.post('/', upload.array('images'),async (req, res) => {
try {
    const urls = [];
    for (const file of req.files) {
      const result = await blogCloudinary.uploader.upload(file.path, {
        folder: 'blogPost_images',
        public_id: `${req.body.blogPostId}-${file.originalname.split('.').slice(0, -1).join('.')}`, // Unique ID (product ID + filename)
      });

      urls.push(result.secure_url);
      fs.unlinkSync(file.path);
    }
    res.status(200).json({ images: urls, message:'Blog images uploaded successfully'  });
} catch (error) {
    res.status(500).json({ message: 'Upload failed', error });
}
  
  });


export default router;