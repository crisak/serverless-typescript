export const PostUserDto = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		username: { type: 'string' },
		name: { type: 'string' },
		image: { type: 'string' },
		hasHobby: { type: 'boolean' }
	},
	required: ['id', 'username', 'name', 'image']
};

const { id, ...propertiesModel } = PostUserDto.properties;

export const PatchUserDto = {
	type: 'object',
	properties: propertiesModel
};
