import axios from 'axios';

export interface AnimeResultDto {
	anime: string;
	character: string;
	quote: string;
}

export class AnimeService {
	constructor() {}

	async getRandom(): Promise<AnimeResultDto> {
		const { data } = await axios.get('https://animechan.vercel.app/api/random');
		return data;
	}
}
