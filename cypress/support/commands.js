import user from '../fixtures/userFixture.json'

let token
before(() => {
	cy.token(user.email, user.password).then(tkn => { token = tkn })
})

Cypress.Commands.add('token', (email, senha) => {
	cy.request({
		method: 'POST',
		url: 'login',
		body: {
			'email': email,
			'password': senha 
		}
	}).then((response) => {
		expect(response.status).to.equal(200)
		return response.body.authorization
	})
})
 
Cypress.Commands.add('login', () => {
	cy.request({
		method: 'POST',
		url: 'login',
		body: {
			'email': 'fulano@qa.com',
			'password': 'teste'
		}
	})
})

Cypress.Commands.add('invalidLogin', () => {
	cy.request({
		method: 'POST',
		url: 'login',
		body: {
			'email': 'fulano@qa.com',
			'password': 'wrongpassword'
		},
		failOnStatusCode: false
	})
})

Cypress.Commands.add('invalidEmail', () => {
	cy.request({
		method: 'POST',
		url: 'login',
		body: {
			'email': 'wrong@qa.com',
			'password': 'teste'
		},
		failOnStatusCode: false
	})
})

Cypress.Commands.add('getUsers', () => {
	cy.request({
		method: 'GET',
		url: 'usuarios'
	})
})

Cypress.Commands.add('postUsers', (name, email, password, boolean) => {
	cy.request({
		method: 'POST',
		url: 'usuarios',
		body:{
			'nome': name,
			'email': email,
			'password': password,
			'administrador': boolean
		}
	})
})

Cypress.Commands.add('postInvalidUser', (name, email, password, boolean) => {
	cy.request({
		method: 'POST',
		url: 'usuarios',
		body:{
			'nome': name,
			'email': email,
			'password': password,
			'administrador': boolean
		},
		failOnStatusCode: false
	})
})

Cypress.Commands.add('searchUser', () => {
	cy.request('GET', 'usuarios').then(response => {
		expect(response.status).to.equal(200)
		expect(response.body.usuarios).to.have.length.greaterThan(0)
		let id = response.body.usuarios[0]._id
		cy.request({
			method: 'GET',
			url: `usuarios/${id}`,
		}).then(buscaResponse => {
			expect(buscaResponse.status).to.equal(200)
			expect(buscaResponse.body._id).to.equal(id)
		})
	})
})

Cypress.Commands.add('userNotFound', () => {
	cy.request({
		method: 'GET',
		url: 'usuarios/asdf123',
		failOnStatusCode: false
	})
})

Cypress.Commands.add('updateUser', (name, email, password, boolean) => {
	cy.request('GET', 'usuarios').then(response => {
		expect(response.status).to.equal(200)
		expect(response.body.usuarios).to.have.length.greaterThan(0)
	
		let lastIndex = response.body.usuarios.length - 1
		let id = response.body.usuarios[lastIndex]._id

		cy.request({
			method: 'PUT',
			url: `usuarios/${id}`,
			body: {
				'nome': name,
				'email': email,
				'password': password,
				'administrador': boolean
			},
			failOnStatusCode: false
		})
	})
})

Cypress.Commands.add('updateNonExistentUser', (name, email, password, boolean) => {
	const randomId = Cypress._.random(100000, 999999)
  
	cy.request({
		method: 'PUT',
		url: `usuarios/${randomId}`,
		body: {
			'nome': name,
			'email': email,
			'password': password,
			'administrador': boolean
		},
		failOnStatusCode: false
	})
})

Cypress.Commands.add('deleteUser', () => {
	cy.request('GET', 'usuarios').then(response => {
		const usuarios = response.body.usuarios
	
		if (usuarios.length >= 2) {
			const lastIndex = usuarios.length - 1
			const lastUserId = usuarios[lastIndex]._id
	
			const lastUserEmail = usuarios[lastIndex].email
	
			if (lastUserEmail !== user.email) {

				cy.request({
					method: 'DELETE',
					url: `usuarios/${lastUserId}`
				})

			} else {
				cy.log('Not allowed to delete the user with the email "fulano@qa.com".')
			}
		}
	})
})


Cypress.Commands.add('getProducts', () => {
	cy.request({
		method: 'GET',
		url: 'produtos'
	})
})

Cypress.Commands.add('getProductById', () => {
	cy.request({
		method: 'GET',
		url: 'produtos'
	}).then((response) => {
		expect(response.status).to.equal(200)
		expect(response.body).to.have.property('produtos')
	
		const produtos = response.body.produtos
		expect(produtos.length).to.be.greaterThan(0)
	
		const randomIndex = Cypress._.random(0, produtos.length - 1)
		const randomProductId = produtos[randomIndex]._id
	
		cy.request({
			method: 'GET',
			url: `produtos/${randomProductId}`
		})
	})
})


Cypress.Commands.add('postProduct', () => {
	let product = `ProductTest ${Math.floor(Math.random() * 100000000)}`
	cy.request({
		method: 'POST',
		url: 'produtos',
		body: {
			'nome': product,
			'preco': 200,
			'descricao': 'New product',
			'quantidade': 100
		},
		headers: { authorization: token }
	})
})

Cypress.Commands.add('newExistingProduct', (product, price, description, quantity) => {
	cy.request({
		method: 'POST', 
		url: 'produtos',
		headers: {authorization: token}, 
		body: {
			'nome': product,
			'preco': price,
			'descricao': description,
			'quantidade': quantity
		}, 
		failOnStatusCode: false
	})
})

Cypress.Commands.add('postInvalidToken', () => {
	let product = `NewProductTest ${Math.floor(Math.random() * 100000000)}`
	cy.request({
		method: 'POST',
		url: 'produtos',
		body: {
			'nome': product,
			'preco': 200,
			'descricao': 'New product',
			'quantidade': 100
		},
		failOnStatusCode: false
	})
})


/*Cypress.Commands.add('editRandomProduct', (token) => {
	let produto = `ProductTest ${Math.floor(Math.random() * 100000000)}`
	cy.postProduct(token, produto, 250, 'New description', 180)
		.then(response => {
			let id = response.body._id

			cy.request({
				method: 'PUT', 
				url: `produtos/${id}`, 
				body: 
				{
					'nome': produto,
					'preco': 200,
					'descricao': 'Product edited',
					'quantidade': 300
				},
				headers: {authorization: token}
			})
		})
})*/