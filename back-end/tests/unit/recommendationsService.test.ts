import { Recommendation } from '@prisma/client'
import { CreateRecommendationData, recommendationService } from '../../src/services/recommendationsService.js'
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js"
import { conflictError, notFoundError } from "../../src/utils/errorUtils.js";
import {jest} from '@jest/globals'

describe("Recommendations Service Unit Tests",()=>{

	describe("insert()", ()=>{
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
			const createRecommendation = jest.spyOn(recommendationRepository, "create").mockResolvedValue(null)

			await recommendationService.insert(expectedRecommendation)

			expect(findRecommendation).toBeCalledTimes(1)
			expect(createRecommendation).toBeCalledWith(expectedRecommendation)
		})
	})

	describe("upvote()", ()=>{
		beforeEach(()=>{
			jest.clearAllMocks()
			jest.resetAllMocks()
		})

		it("should fail to find id of recommendation to be upvoted", async()=>{
			jest.spyOn(recommendationRepository, "find").mockResolvedValue(null)

			expect(async()=>{
				await recommendationService.upvote(0)
			}).rejects.toEqual(notFoundError(""))
		})

		it("should succeed to find id of recommendation to be upvoted and vote it", async()=>{
			const recommendation: Recommendation = {
				id: 1,
				name: 'asd',
				youtubeLink: 'dsa',
				score: 1
			}
			const successToFindId = jest.spyOn(recommendationRepository, "find").mockResolvedValue(recommendation)
			const updatedScore = jest.spyOn(recommendationRepository, "updateScore").mockResolvedValue(null)

			await recommendationService.upvote(recommendation.id)

			expect(successToFindId).toBeCalledTimes(1)
			expect(updatedScore).toBeCalledTimes(1)
		})
	})

	describe("downvote()", ()=>{
		beforeEach(()=>{
			jest.clearAllMocks()
			jest.resetAllMocks()
		})

		it("should fail to find id of recommendation to be downvoted", async()=>{
			
			jest.spyOn(recommendationRepository, "find").mockResolvedValue(null)
			expect(async()=>{
				await recommendationService.downvote(0)
			}).rejects.toEqual(notFoundError(""))
		})

		it("should succeed to find id of recommendation to be downvoted and vote it but not delete it", async()=>{
			const recommendation: Recommendation = {
				id: 1,
				name: 'asd',
				youtubeLink: 'dsa',
				score: 0
			}
			const successToFindId = jest.spyOn(recommendationRepository, "find").mockResolvedValue(recommendation)
			const downvoted = jest.spyOn(recommendationRepository, "updateScore").mockResolvedValue(recommendation)
			const deleted = jest.spyOn(recommendationRepository, "remove")

			await recommendationService.downvote(1)

			expect(successToFindId).toBeCalledTimes(1)
			expect(downvoted).toBeCalledWith(recommendation.id, "decrement")
			expect(deleted).toBeCalledTimes(0)
		})

		it("should succeed to find id of recommendation to be downvoted, vote it and delete it", async()=>{
			const recommendation: Recommendation = {
				id: 1,
				name: 'asd',
				youtubeLink: 'dsa',
				score: -6
			}
			const successToFindId = jest.spyOn(recommendationRepository, "find").mockResolvedValue(recommendation)
			const downvoted = jest.spyOn(recommendationRepository, "updateScore").mockResolvedValue(recommendation)
			const deleted = jest.spyOn(recommendationRepository, "remove")

			await recommendationService.downvote(1)

			expect(successToFindId).toBeCalledTimes(1)
			expect(downvoted).toBeCalledWith(recommendation.id, "decrement")
			expect(deleted).toBeCalledTimes(1)
		})
	})

	describe("get()", ()=>{
		beforeEach(()=>{
			jest.clearAllMocks()
			jest.resetAllMocks()
		})

		it("should get all recommendations", async()=>{
			const allRecommendations = jest.spyOn(recommendationRepository, "findAll").mockResolvedValue(null)
			await recommendationService.get()
			expect(allRecommendations).toBeCalledTimes(1)
		})
	})

	describe("getTop()", ()=>{
		beforeEach(()=>{
			jest.clearAllMocks()
			jest.resetAllMocks()
		})

		it("should get `amount` number of recommendations ranked by votes", async()=>{
			const amount = 10
			const getMeAmountRecommendations = jest.spyOn(recommendationRepository, "getAmountByScore").mockReturnValue(null)

			await recommendationService.getTop(amount)
			expect(getMeAmountRecommendations).toBeCalledWith(amount)
		})

	})

	describe("getRandom() - nested functions", ()=>{
		describe("getScoreFilter()", ()=>{
			beforeEach(()=>{
				jest.clearAllMocks()
				jest.resetAllMocks()
			})

			it("should return 'gt' given number < 0.7", async()=>{
				const filter = recommendationService.getScoreFilter(0.6)
				expect(filter).toBe('gt')
			})
			it("should return 'gt' given number >= 0.7", async()=>{
				const filter = recommendationService.getScoreFilter(0.8)
				expect(filter).toBe('lte')
			})
		})

		describe("getByScore()",()=>{
			beforeEach(()=>{
				jest.clearAllMocks()
				jest.resetAllMocks()
			})

			it("should return recommendations given score filter if it is an array with length > 0",async()=>{
				const recommendation = 
				[
					{
						id: 1,
						name: 'asd',
						youtubeLink: 'dsa',
						score: 0
					}
				]
				const recommendations = jest.spyOn(recommendationRepository, "findAll").mockResolvedValue(
					recommendation
				)

				const returnedRecommendations = await recommendationService.getByScore('gt')
				expect(recommendations).toBeCalledTimes(1)
				expect(returnedRecommendations).toBe(recommendation)
			})

			it("should return findAll function given first call returned an array with length 0",async()=>{
				
				const fn = jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([])

				await recommendationService.getByScore('gt')
				expect(fn).toBeCalledTimes(2)
			})
		})

		describe("getRandom() - process",()=>{
			beforeEach(()=>{
				jest.clearAllMocks()
				jest.resetAllMocks()
			})
			it("should generate a random number, get score filter based on it and attempt to get a recommendation based on that and fail",async()=>{
				const score = 'lte'
				jest.spyOn(recommendationService, "getScoreFilter").mockReturnValue(score)
				jest.spyOn(recommendationService, "getByScore").mockResolvedValue([])
				jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([])
				expect(async()=>{
					await recommendationService.getRandom()
				}).rejects.toEqual(notFoundError(""))
			
			})

			it("should generate a random number, get score filter based on it and successfully get a recommendation based on that",async()=>{
				const score = 'lte'

				const recommendation = [
					{
						id: 1,
						name: 'asd',
						youtubeLink: 'dsa',
						score: 5
					}
				]
				jest.spyOn(recommendationService, "getScoreFilter").mockReturnValue(score)
				jest.spyOn(recommendationService, "getByScore").mockResolvedValue(recommendation)
				jest.spyOn(recommendationRepository, "findAll").mockResolvedValue(recommendation)
				const returnedRecommendation = await recommendationService.getRandom()
				expect(returnedRecommendation).toBe(recommendation[0])
			})
		})

		describe("truncate()", ()=>{
			it("should run the truncate function", async()=>{
				const truncated = jest.spyOn(recommendationRepository, "truncate").mockResolvedValue(null)
				await recommendationService.truncate()
				expect(truncated).toBeCalledTimes(1)
			})
		})
	})
})

function mockRandomNumber(number: number) {
	const mockMathRandom = Object.create(global.Math);
	mockMathRandom.random = () => number;
	global.Math = mockMathRandom;
  
	return mockMathRandom;
  }