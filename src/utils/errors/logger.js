import winston from 'winston'
import path from 'path'
import DailyRotateFile from 'winston-daily-rotate-file'

const { combine, timestamp, printf, align } = winston.format

// Get the path to the logs folder
const {pathname: root} = new URL('../../../logs/', import.meta.url)
const logDirectory = root;

const errorFilter = winston.format(info => {
	return info.level === 'error' ? info : false
})

const infoFilter = winston.format(info => {
	return info.level === 'info' ? info : false
})

const format = {
	timestamp: timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SS A' }),
	align: align(),
	format: printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
}

export const logger = winston.createLogger({
	colorize: true,
	level: process.env.LOG_LEVEL || 'critical',
	format: combine(timestamp()),
	transports: [
		new winston.transports.File({
			filename: logDirectory + 'errors.log',
			level: 'error',
			format: combine(
				errorFilter(),
				format.timestamp,
				format.align,
				format.format
			),
		}),
		new DailyRotateFile({
			filename: logDirectory + 'info-%DATE%.log',
			level: 'info',
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d',
			format: combine(
				infoFilter(),
				format.timestamp,
				format.align,
				format.format
			),
		}),
	],
})