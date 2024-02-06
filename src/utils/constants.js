import path from 'path'

export const APP_NAMES = {
	APP1: 'omniwound',
	APP2: 'web-api',
}

export const ROLES = {
	ADMIN: 'admin',
	USER: 'user',
	WOUND_UPLOAD: 'wound-upload',
}

export const ENDPOINTS = {
	USERS: '/api/v1/users/',
	IMAGES: '/api/v1/wound-images/',
}

// Allowed image types
export const ALLOWED_IMAGE_TYPES = [
	'image/jpeg',
	'image/png',
	'image/heic',
	'image/gif',
	'image/bmp',
]

const {pathname: root} = new URL('../../uploads', import.meta.url)

export const UPLOADS_FOLDER = root;