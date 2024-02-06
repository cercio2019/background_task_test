import NodeClam from 'clamscan'
import { logger } from './errors/logger.js'

// Initialize ClamAV scanner
const clamScanOptions = {
	removeInfected: false,
	quarantineInfected: false,
	scanLog: null,
	debugMode: false,
	fileList: null,
	scanRecursively: true,
	clamdscan: {
		socket: '/var/run/clamav/clamd.ctl', // This is the default, change if needed
		host: 'localhost',
		port: 3310,
		timeout: 60000,
		localFallback: false,
		path: '/usr/bin/clamdscan',
		configFile: null,
		multiscan: true,
		reloadDb: false,
		active: true,
	},
	preference: 'clamdscan',
}

// Declare the clamscanClient variable but don't initialize it yet
let clamscanClient
let isClamAVInitialized = false

// Asynchronous function to initialize ClamAV scanner
const initializeClamScan = async () => {
	if (isClamAVInitialized) {
		return // Skip initialization if it's already done
	}

	try {
		clamscanClient = await new NodeClam().init(clamScanOptions)
		console.log('ClamAV initialized successfully.')
		logger.info('ClamAV initialized successfully.')
		isClamAVInitialized = true // Set the flag to true on successful initialization
	} catch (err) {
		console.error('Error initializing ClamAV:', err)
		logger.error('Error initializing ClamAV:', err)
	}
}

// Self-invoking function to initialize ClamAV
;(async () => {
	await initializeClamScan()
})()

export { clamscanClient, isClamAVInitialized }