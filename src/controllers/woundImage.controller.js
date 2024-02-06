import fs from 'fs'
//import { PutObjectCommand } from '@aws-sdk/client-s3'

import  back_one  from  '../../queues.js';

// Utils
//import { s3Client } from '../utils/s3Client'

// Models
//import { createWoundImage, getWoundImages } from '../models/woundImage.model'

// Validators
//import { validateGetByIdPage } from '../validators/woundsValidator'

// Utils
//import { validateRequest } from '../utils/errors/validateRequest'
import { logger } from '../utils/errors/logger.js'


export const upload = async (req, res) => {
	
	// Retrieve file from request
	console.log('File received:', req.file)
	const file = req.file
	const fileName = file.filename
	const filePath = file.path
	const fileExt = file.mimetype // Use the mimetype from multer
	

	// ClamAV scan
	try {
		await back_one.add({ filePath });
		back_one.on("global:completed", async (jobId, result) => {
			
		const data = JSON.parse(result);
		let isInfected = data.isInfected;
		let viruses = data.viruses;
	
		console.log('isInfected', isInfected)
		console.log('viruses', viruses)

		logger.info(`
-- ClamAV scan results --
isInfected: ${isInfected}
viruses: ${viruses}
-------------------------
		`)

		// If infected, block upload
		if (isInfected) {
			logger.error(`
upload an infected file.
The file is infected with ${viruses.join(', ')}
			`)

			// Remove file from server
			deleteFile(filePath)
			return res.status(400).json({
				error: `The file is infected with ${viruses.join(', ')}`,
			})
		}else{

          console.log(`FIle no infected with virus`);
            
        }

		});
		
	} catch (clamavError) {
		console.error('Clamdscan error:', clamavError);
		logger.error('ClamAV scan error:', clamavError);

		// Remove file from server
		deleteFile(filePath);

		// Block uploads when ClamAV fails
		return res.status(500).json({
			error:'Internal server error during virus scanning. Please try again later.',
		});
	}

	try {
		const fileStream = fs.createReadStream(filePath)
		fileStream.on('error', function (err) {
			console.error('File Stream Error:', err)
			// Remove file from server
			deleteFile(filePath)

			// Return error response
			return res.status(500).json({
				error:'Internal server error during file upload. Please try again later.',
			})
		})

		res.status(200).json({
			message: 'File uploaded and record created successfully.'
			//record: record,
		})

	} catch (error) {
		logger.error('Upload error:', error.message)
		res.status(500).json({
			error: 'Internal server error. Please try again later.',
		})
	} 
}

const deleteFile = filePath => {
	console.log('Deleting file:', filePath)
	fs.unlink(filePath, err => {
		if (err) {
			console.error('Error deleting file:', err)
		}
	})
}