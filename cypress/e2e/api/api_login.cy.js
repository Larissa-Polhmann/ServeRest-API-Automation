/// <reference types="Cypress"/>

describe('User functionality validation', () => {

	context('Login functionality test', () => {
		it('Should perform the login', () => {
			cy.login()
				.then((response) => {
					expect(response.status).to.equal(200)
				}) 
		}),

		it('Invalid password', () => {
			cy.invalidLogin()
				.then((response) => {
					expect(response.status).to.equal(401)
				}) 
		})

		it('Invalid email', () => {
			cy.invalidEmail()
				.then((response) => {
					expect(response.status).to.equal(401)
				}) 
		})
	})
})