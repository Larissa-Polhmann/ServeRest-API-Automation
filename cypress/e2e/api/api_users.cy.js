import { faker } from '@faker-js/faker'
import user from '../../fixtures/userFixture.json'

describe('User functionality validation', () => {

	context('User registration validations', () => {

		it('Should retrieve the registered users', () => {
			cy.getUsers()
				.then((response) => {
					expect(response.status).to.equal(200)
				}) 
		})

		it('Should register a user', () => {
			cy.postUsers(faker.person.fullName(), faker.internet.email(), faker.internet.password(), 'true')
				.then((response) => {
					expect(response.status).to.equal(201)
				}) 
		})

		it('Should validate the registration of an existing user', () => {
			cy.postInvalidUser(faker.person.fullName(), user.email, faker.internet.password(), 'true')
				.then((response) => {
					expect(response.status).to.equal(400)
				}) 
		})
	})


	context('User listing validation', () => {
		
		it('Should search user by id', () => {
			cy.searchUser()
				.then((response) => {
					expect(response.status).to.equal(200)
				}) 
		})
	
		it('Must validate user not found', () => {
			cy.userNotFound()
				.then((response) => {
					expect(response.status).to.equal(400)
				})
		})
	})


	context('Validating the edit functionality', () => {
	
		it('Should edit a registered user', () => {
			cy.updateUser(faker.person.fullName(), faker.internet.email(), faker.internet.password(), 'true')
				.then((response) => {
					expect(response.status).to.equal(200)
				})
		})

		it('Should not allow editing with an already registered email', () => {
			cy.updateUser(faker.person.fullName(), user.email, faker.internet.password(), 'true')
				.then((response) => {
					expect(response.status).to.equal(400)
				})
		})

		it('Should register a user in edit', () => {
			cy.updateNonExistentUser(faker.person.fullName(), faker.internet.email(), faker.internet.password(), 'true')
				.then((response) => {
					expect(response.status).to.equal(201)
				})
		})
	})

	context('User deletion validation', () => {

		it('Should delete a user', () => {
			cy.deleteUser()
				.then((response) => {
					expect(response.status).to.equal(200)
				})
		})
	})
})