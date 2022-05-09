import { Recommendation } from '@prisma/client'
import { CreateRecommendationData, recommendationService } from '../../src/services/recommendationsService.js'
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js"
import { conflictError, notFoundError } from "../../src/utils/errorUtils.js";
import {jest} from '@jest/globals'

describe("Recommendations Service Unit Tests",()=>{


	beforeEach(()=>{
		jest.clearAllMocks()
		jest.resetAllMocks()
	})


	it("should reject a recommendation that already exists", async()=>{
		const data = {
			name: 'asd',
			youtubeLink: 'dsa'
		}
		jest.spyOn(recommendationRepository, "findByName").mockResolvedValue({
			id: 1,
			name: 'asd',
			youtubeLink: 'dsa',
			score: 1
		})

		expect(async()=>{
			await recommendationService.insert(data)
		}).rejects.toEqual(conflictError("Recommendations names must be unique"))
	})

	it("should add a new recommendation", async()=>{
		const findRecommendation = jest.spyOn(recommendationRepository, "findByName").mockResolvedValue(null)
		
		const expectedRecommendation: CreateRecommendationData = {
			name: 'asd',
			youtubeLink: 'dsa'
		}

		const createRecommendation = jest.spyOn(recommendationRepository, "create")

		expect(findRecommendation).toBeCalledTimes(1)
		expect(createRecommendation).toBeCalledWith(expectedRecommendation)
	})

	it("should fail to find id of recommendation to vote it", async()=>{
		const failureToFindId = jest.spyOn(recommendationRepository, "find").mockResolvedValue(null)
		expect(failureToFindId).toBeCalledTimes(1)
		expect(async()=>{
			await recommendationService.getById(0)
		}).rejects.toEqual(notFoundError)
	})

	it("should succeed to find id of recommendation to vote it", async()=>{
		const recommendation: Recommendation = {
			id: 1,
			name: 'asd',
			youtubeLink: 'dsa',
			score: 1
		}
		const successToFindId = jest.spyOn(recommendationRepository, "find").mockResolvedValue(recommendation)
		expect(successToFindId).toBeCalledTimes(1)
	})

	it("should upvote a recommendation", async()=>{
		const id = 1
		const upvoted = jest.spyOn(recommendationRepository, "updateScore").mockResolvedValue(null)
		expect(upvoted).toBeCalledWith(id, "increment")
	})

	it("should downvote a recommendation, but not delete it", async()=>{
		const recommendation: Recommendation = {
			id: 1,
			name: 'asd',
			youtubeLink: 'dsa',
			score: 1
		}
		const downvoted = jest.spyOn(recommendationRepository, "updateScore").mockResolvedValue(recommendation)
		expect(downvoted).toBeCalledWith(recommendation.id, "decrement")
	})

	it("should downvote a recommendation and delete it", async()=>{
		const recommendation: Recommendation = {
			id: 1,
			name: 'asd',
			youtubeLink: 'dsa',
			score: -6
		}
		const downvoted = jest.spyOn(recommendationRepository, "updateScore").mockResolvedValue(recommendation)
		const deleted = jest.spyOn(recommendationRepository, "remove")
		expect(downvoted).toBeCalledWith(recommendation.id, "decrement")
		expect(deleted).toBeCalledWith(recommendation.id)
	})

	it("should get all recommendations", async()=>{
		const allRecommendations = jest.spyOn(recommendationRepository, "findAll")
		expect(allRecommendations).toBeCalledTimes(1)
	})

	it("should get fixed amount of recommendations", async()=>{
		const amount = 10
		const getMeAmountRecommendations = jest.spyOn(recommendationRepository, "getAmountByScore")
		expect(getMeAmountRecommendations).toBeCalledWith(amount)
	})

	it("should get 'gt' from filter if given params number is higher than 0.7", async()=>{
		const filter = recommendationService.getScoreFilter(0.8)
		expect(filter).toBe('gt')
	})

	it("should get 'lte' from filter if given params number is lower than or equal to 0.7", async()=>{
		const less = recommendationService.getScoreFilter(0.6)
		const equal = recommendationService.getScoreFilter(0.7)
		expect(less).toBe('lte')
		expect(equal).toBe('lte')
	})

	it("should return recommendations if it's array length is > 0", async()=>{
		const recommendations = jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([{
			id: 1,
			name: 'asd',
			youtubeLink: 'dsa',
			score: 1
		}])
		const calledGetByScore = recommendationService.getByScore('gt')
		expect(recommendations).toBeCalledTimes(1)
		expect(calledGetByScore).toBe(recommendations)
	})

	it("should return the function that gets all recommendations if first try with scorefilter parameter returns array of length 0", async()=>{
		const recommendations = jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([])
		const calledGetByScore = recommendationService.getByScore('gt')
		expect(recommendations).toBeCalledTimes(1)
		expect(calledGetByScore).toBe(recommendationRepository.findAll)
	})

	it("should truncate whole recommendations table",async()=>{
		const truncate = jest.spyOn(recommendationService, "truncate")
		expect(truncate).toBeCalledTimes(1)
	})
	
})