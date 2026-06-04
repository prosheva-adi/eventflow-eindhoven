/* eslint-disable no-undef */
describe('Navigation', () => {
    it('should load the home page', () => {
        cy.visit('/')
        cy.location('pathname').should('eq', '/')
    })

    it('should navigate to events page', () => {
        cy.visit('/events')
        cy.location('pathname').should('eq', '/events')
    })

    it('should navigate to login page', () => {
        cy.visit('/login')
        cy.contains('Sign in to your account').should('exist')
    })

    it('should navigate to register page', () => {
        cy.visit('/register')
        cy.location('pathname').should('eq', '/register')
    })

    it('should not show venues in navbar for guest', () => {
        cy.visit('/')
        cy.get('nav').should('not.contain', 'Venues')
    })

    it('should show venues in navbar for admin', () => {
        cy.clearAllCookies()
        cy.clearAllLocalStorage()
        cy.visit('/login')
        cy.intercept('POST', '**/login').as('loginRequest')
        cy.get('input[type="email"]').type('admin@gmail.com')
        cy.get('input[type="password"]').type('Admin123')
        cy.get('button[type="submit"]').click()
        cy.wait('@loginRequest').then((interception) => {
            cy.log('STATUS:', interception.response.statusCode)
            cy.log('BODY:', JSON.stringify(interception.response.body))
        })
        cy.location('pathname').should('not.eq', '/login')
        cy.get('nav').should('contain', 'Venues')
    })
})