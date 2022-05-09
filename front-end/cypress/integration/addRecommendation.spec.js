describe("testing whole recommendating system: adding, voting, recommending", ()=>{

	it("should add 3 recommendations successfully", ()=>{

		//Arrange
		cy.request('POST', '/e2e/truncate', {})
		cy.visit("http://localhost:3000/")
		cy.fixture('songs.json').then(json=>{
			//Act and Assert
			json.songs.forEach(song=>{
				cy.addNew(song)

			})
		})
	})

	it("should vote on all 3 recommendations", ()=>{
		cy.fixture('voting.json').then(json=>{
			console.log(parseInt(json.voting[0][0]))
			for(let i = 0; i < json.voting.length; i++){
				for(let j = 0; j < json.voting[i].length; j++){
					if(j == 0 && parseInt(json.voting[i][j]) < 0) cy.downvote(i, json.voting[i][j])
					else if(j == 0 && parseInt(json.voting[i][j]) > 0) cy.upvote(i, json.voting[i][j])
					else if(json.voting[i][j - 1] < json.voting[i][j]) cy.upvote(i, json.voting[i][j])
					else cy.downvote(i, json.voting[i][j])
				}
			}
		})
	})

	it("should return all recommendations, ranked", ()=>{
		cy.visit("http://localhost:3000/top")
		cy.fixture('ranking.json').then(json=>{
			json.ranking.forEach((item, index)=>{
				cy.checkRank(item, index)
			})
		})
	})
})