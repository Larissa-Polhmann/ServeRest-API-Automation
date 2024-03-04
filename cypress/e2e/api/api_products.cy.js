/* eslint-disable no-unused-vars */
import user from '../../fixtures/userFixture.json'

describe('Product functionality validation', () => {

	let token
	before(() => {
		cy.token(user.email, user.password).then(tkn => { token = tkn })
	})

	context('Products listing validation', () => {

		it('Should list the products', () => {
			cy.getProducts()
				.then((response) => {
					expect(response.status).to.equal(200)
					expect(response.duration).to.be.lessThan(20)
				})
		})

		it('Should search product by id', () => {
			cy.getProductById()
				.then((produtoResponse) => {
					expect(produtoResponse.status).to.equal(200)
				})
		})
	})


	context('Product registration validation', () => {

		it('Should successfully register the product', () => {
			cy.postProduct()
				.then((response) => {
					expect(response.status).to.equal(201)
				})
		})

		it('Should validate error when registering a duplicate product.', () => {
			cy.newExistingProduct(token, 'ProductTest', 250, 'New description', 180)
				.then((response) => {
					expect(response.status).to.equal(400)
				})
		})

		it('Should validate missing token', () => {
			cy.postInvalidToken()
				.then((response) => {
					expect(response.status).to.equal(401)
				})
		})
	})

	/*context('Product editing validation', () => {

		it.only('Should edit a product', () => {
			cy.editRandomProduct()
				.then((response) => {
					expect(response.status).to.equal(200)
				})
		})
	})*/
})