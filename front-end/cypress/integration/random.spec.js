describe("testing random page: should return a random video", () => {
	beforeEach(() => {
		cy.request('POST', '/e2e/truncate', {})
		cy.request('POST', 'e2e/seed')
	});
  
	it("should return recommendations greater than or equal to -4", () => {
	  cy.visit("http://localhost:3000/");
  
	  cy.contains("Random").click();
  
	  cy.url().should("equal", "http://localhost:3000/random");
  
	  cy.get("article:first-of-type").within(() => {
		cy.get("div:last-of-type").should(($div) => {
		  const text = parseInt($div.text());
  
		  expect(text).to.be.greaterThan(-5);
		});
	  });
	});
  });