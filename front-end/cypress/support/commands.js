// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('addNew', (data)=>{

	//Act
	cy.get("input[placeholder='Name']").type(data.name)
	cy.get("input[placeholder='https://youtu.be/...'").type(data.link)
	cy.intercept('POST', '/recommendations').as("create-recommendation")
	cy.get('button').click()
			
	//Assert
	cy.wait('@create-recommendation')

})

Cypress.Commands.add('upvote', (element, votes)=>{
	cy.intercept('POST', /^\/recommendations\/[0-9]{1,}\/upvote$/).as('upvote')
	cy.get('article').eq(element).as('article')
	cy.get('@article').find('div').eq(3).as('div')
	cy.get('@div').find('svg').eq(0).click()
	cy.wait('@upvote')
	cy.get('@div').contains(/^[0-9]{1,}$/).should(($div) => {
		// access the native DOM element
		expect($div.get(0).innerText).to.eq(votes)
	  })
})

Cypress.Commands.add('downvote', (element, votes)=>{
	cy.intercept('POST', /^\/recommendations\/[0-9]{1,}\/downvote$/).as('downvote')
	cy.get('article').eq(element).as('article')
	cy.get('@article').find('div').eq(3).as('div')
	cy.get('@div').find('svg').eq(1).click()
	cy.wait('@downvote')
	cy.get('@div').contains(/^[0-9]{1,}$/).should(($div) => {
		// access the native DOM element
		expect($div.get(0).innerText).to.eq(votes)
	  })
})

Cypress.Commands.add('checkRank', (element, votes)=>{
	cy.get('article').eq(element).as('article')
	cy.get('@article').find('div').eq(3).as('div')
	cy.get('@div').find('svg').eq(1).click()
	cy.wait('@downvote')
	cy.get('@div').contains(/^[0-9]{1,}$/).should(($div) => {
		// access the native DOM element
		expect($div.get(0).innerText).to.eq(votes)
	  })
})