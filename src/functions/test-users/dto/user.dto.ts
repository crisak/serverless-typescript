export const PostUserDto = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		username: { type: 'string' },
		name: { type: 'string' },
		image: { type: 'string' }
		// hasHobby: { type: 'boolean' }
	},
	required: ['id', 'username', 'name', 'image']
};

export const PatchUserDto = {
	type: 'object',
	properties: {
		name: { type: 'string' },
		image: { type: 'string' },
		hasHobby: { type: 'boolean' }
	},
	required: []
};
