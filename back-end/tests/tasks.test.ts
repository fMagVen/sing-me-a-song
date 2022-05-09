/*
describe("isolation placeholder",()=>{
	it("should pass the test",()=>{
		expect(1).toBe(1)
	})
})
*/

import app from '../src/app.js'
import {jest} from '@jest/globals'
import { prisma } from '../src/database.js'
import supertest from 'supertest'
import { generateRecommendation, getRandomInt } from './factories/recommendationsFactory.js'
import { recommendationRepository } from '../src/repositories/recommendationRepository.js'

jest.setTimeout(180000)
describe("Recommendation tests", ()=>{

	describe("POST /recommendations", ()=>{
		
		beforeAll(async()=>{
			await recommendationRepository.truncate()
		})
		
		it("given data in wrong schema should return 422", async()=>{
			const first = {
				random: 'wrong'
			}
			let response = await supertest(app).post('/recommendations').send(first)
			expect(response.status).toEqual(422)
			
			const second = {
				name: 'asd',
				youtubeLink: 'https://instagram.com'
			}
			response = await supertest(app).post('/recommendations').send(second)
			expect(response.status).toEqual(422)

			const third = {
				name: 1234,
				youtubeLink: 'https://youtube.com'
			}
			response = await supertest(app).post('/recommendations').send(third)
			expect(response.status).toEqual(422)
		})
		
		it("given data in valid schema should return 201", async()=>{
			const data = await generateRecommendation()
			const response = await supertest(app).post('/recommendations').send(data)
			expect(response.status).toEqual(201)
		})
		
		it("given repeated recommendation should return 409", async()=>{
			const data = await generateRecommendation()
			const responseone = await supertest(app).post('/recommendations').send(data)
			expect(responseone.status).toEqual(201)
			const responsetwo = await supertest(app).post('/recommendations').send(data)
			expect(responsetwo.status).toEqual(409)
		})
		
		afterAll(async()=>{
			await recommendationRepository.truncate()
			await prisma.$disconnect()
		})

		describe("POST /recommendations/:id/upvote",()=>{

			it("should return 404 when id doesnt exist",async()=>{
				const response = await supertest(app).post('recommendations/0/upvote')
				expect(response.status).toBe(404)
			})

			it("should return recommendation with it's score +1", async()=>{
				const data = await generateRecommendation()
				await recommendationRepository.create(data)
				const song = await recommendationRepository.findByName(data.name)
				await supertest(app).post(`/recommendations/${song.id}/upvote`)
				const response = await recommendationRepository.find(song.id)
				expect(response.score).toEqual(song.score + 1)
			})
		})

		describe("POST /recommendations/:id/downvote",()=>{

			it("should return 404 when id doesnt exist",async()=>{
				const response = await supertest(app).post('recommendations/0/downvote')
				expect(response.status).toBe(404)
			})

			it("should return recommendation with it's score -1", async()=>{
				const data = await generateRecommendation()
				await recommendationRepository.create(data)
				const song = await recommendationRepository.findByName(data.name)
				await supertest(app).post(`/recommendations/${song.id}/downvote`)
				const response = await recommendationRepository.find(song.id)
				expect(response.score).toEqual(song.score - 1)
			})

			it("should delete recommendation after score gets lower than -5", async()=>{
				await prisma.$executeRaw`INSERT into "recommendations"(name, "youtubeLink", score) VALUES('lixo de video', 'https://www.youtube.com/watch?v=4MFOBeUCPkw', -5)`
				const song = await recommendationRepository.findByName('lixo de video')
				await supertest(app).post(`/recommendations/${song.id}/downvote`)
				const deleted = await recommendationRepository.find(song.id)
				expect(deleted).toBeNull
			})

			afterAll(async()=>{
				await recommendationRepository.truncate()
				await prisma.$disconnect()
			})

		})
	})

	describe("GET /recommendations", ()=>{

		beforeAll(async()=>{
			for(let i = 0; i < 20; i++){
				const entry = await generateRecommendation(true)
				await prisma.$executeRaw`INSERT into "recommendations"(name, "youtubeLink", score) VALUES(${entry.name}, ${entry.youtubeLink}, ${entry.score})`
			}
		})

		it("should return up to 10 last entries", async()=>{
			const data = await supertest(app).get('/recommendations')
			expect(data.body).toHaveLength(10)
		})

		it("on route /:id, should return 404 when id doesnt exist",async()=>{
			const response = await supertest(app).get('recommendations/0')
			expect(response.status).toBe(404)
		})

		it("on route /random, should return a random song",async()=>{
			const response = await supertest(app).get('/recommendations/random')
			expect(response.body.id).toBeTruthy()
		})

		it("on route /top/:amount returns the `amount` most upvoted songs",async()=>{
			const number = getRandomInt(0,20)
			const response = await supertest(app).get(`/recommendations/top/${number}`)
			expect(response.body).toHaveLength(number)
			for(let i = 0; i < response.body.length; i++){
				if(i < response.body.length - 1) expect(response.body[i].score).toBeGreaterThanOrEqual(response.body[i+1].score)
			}
		})

		afterAll(async()=>{
			await recommendationRepository.truncate()
			await prisma.$disconnect()
		})

	})
})

describe("e2e routers test",()=>{

	it("should seed recommendations table successfully and return 200",async()=>{
		const response = await supertest(app).post('/e2e/seed')
		expect(response.status).toBe(200)
	})

	it("should truncate recommendations table successfully and return 200",async()=>{
		const response = await supertest(app).post('/e2e/truncate')
		expect(response.status).toBe(200)
	})
})