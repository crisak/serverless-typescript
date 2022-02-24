export default {
	type: 'object',
	properties: {
		id: { type: 'string' },
		username: { type: 'string' },
		name: { type: 'string' },
		image: { type: 'string' }
	},
	required: ['id', 'username', 'name', 'image']
} as const;
