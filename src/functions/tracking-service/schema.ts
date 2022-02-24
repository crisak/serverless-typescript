export default {
	type: 'object',
	properties: {
		serviceId: { type: 'string' },
		trackingId: { type: 'string' },
		courier: { type: 'string' },
		date: { type: 'string' }
	},
	required: ['serviceId', 'trackingId', 'courier', 'date']
} as const;
