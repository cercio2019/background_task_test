import { Router } from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

// Utils
import {UPLOADS_FOLDER, ALLOWED_IMAGE_TYPES } from '../utils/constants.js'

// Controller
import * as woundCtrl from '../controllers/woundImage.controller.js'

const router = Router()
// Use disk storage to save the file to the server
const storage = multer.diskStorage({
	
	destination: (req, file, cb) => {
		cb(null, UPLOADS_FOLDER)
	},
	filename: (req, file, cb) => {
		const fileExt = path.extname(file.originalname).toLowerCase() || '.jpg'
		const fileName = uuidv4() + fileExt // Generate a unique name
		cb(null, fileName)
	},
})

// Set up Multer for file uploads with validation
const fileFilter = async (req, file, cb) => {
	try {
		// Check if file is not an image
		if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
			// Reject file
			const allowedExtensions = ALLOWED_IMAGE_TYPES.join(', ')
			cb(
				new Error(`Invalid file type. Allowed types: ${allowedExtensions}.`),
				false
			)
		}

		// Accept file
		cb(null, true)
	} catch (error) {
		// Handle error
		console.error(error)
		cb(new Error('Error processing file.'), false)
	}
}

// Set up Multer
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 10, // 10MB file size limit
	},
	fileFilter: fileFilter,
})

router.post('/upload', upload.single('image'), woundCtrl.upload) // Upload image

export default router