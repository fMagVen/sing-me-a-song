import randomUrlGen from 'random-youtube-music-video'
import {faker} from '@faker-js/faker'

interface recommendationEntry {
	name: string,
	youtubeLink: string,
	score?: number
}

export async function generateRecommendation(score?: boolean){
	const name = faker.lorem.words(3)
	const youtubeLink = await randomUrlGen.getRandomMusicVideoUrl()
	const data: recommendationEntry = {
		name,
		youtubeLink
	}
	if(score){
		const score = getRandomInt(-5, 500)
		const added: recommendationEntry = {...data, score}
		return added
	}
	return data
}

export function getRandomInt(min: number, max: number){
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min)
}