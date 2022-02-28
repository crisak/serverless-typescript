export class ValidObject {
	static isValid(object: any): boolean {
		return (
			object && typeof object === 'object' && Object.keys(object).length > 0
		);
	}
}
