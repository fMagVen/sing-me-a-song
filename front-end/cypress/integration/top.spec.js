describe("testing top page: checking order", () => {
	beforeEach(() => {
		cy.request('POST', '/e2e/truncate', {})
		cy.request('POST', 'e2e/seed')
	});
  
	it("should return recommendations in order of upvotes ranking", () => {
	  cy.visit("http://localhost:3000/");
  
	  cy.contains("Top").click();
  
	  cy.url().should("equal", "http://localhost:3000/top");
  
	  cy.get("article:first-of-type").within(() => {
		cy.get("div:last-of-type").should("have.text", "300");
	  });
  
	  cy.get("article:last-of-type").within(() => {
		cy.get("div:last-of-type").should("have.text", "-4");
	  });
	});

  });