import recommendationFactory from "./factories/recommendationFactory";

describe("testing home page: adding, upvoting, downvoting", ()=>{

	beforeEach(() => {
		cy.request('POST', '/e2e/truncate', {})
		cy.visit("http://localhost:3000/")
	  });

	it("should add a recommendation successfully", ()=>{

		//Arrange
		const recommendation = recommendationFactory();
		//Act
		cy.addRecommendation(recommendation);
		//Assert
		cy.contains(recommendation.name);
		cy.end();
	})

	it("should return an alert when registering an existing recommendation", () => {

		const recommendationone = recommendationFactory();
		cy.addRecommendation(recommendationone);
		const recommendationtwo = recommendationFactory();
		cy.addRecommendation(recommendationtwo);
		cy.alertTest();
	
		cy.end();
	});

	it("should return an alert when registering an invalid recommendation", () => {
		const recommendation = {
			name: 'test',
			youtubeLink: 'www.abc.com'
		}
		cy.addRecommendation(recommendation);
	
		cy.alertTest();
	
		cy.end();
	});

	it("should increase recommendation counter", () => {
		const recommendation = recommendationFactory();
	
		cy.addRecommendation(recommendation);
	
		cy.upvote(recommendation);
	
		cy.end();
	});
	
	it("should downvote a recommendation", () => {
		const recommendation = recommendationFactory();
	
		cy.addRecommendation(recommendation);
	
		cy.downvote(recommendation);
	
		cy.end();
	});

	it("should exclude the recommendation by decreasing the counter 5 times", () => {
		const recommendation = recommendationFactory();
	
		cy.addRecommendation(recommendation);
	
		cy.delete(recommendation);
	
		cy.contains("No recommendations yet! Create your own :)");
	
		cy.end();
	})

})