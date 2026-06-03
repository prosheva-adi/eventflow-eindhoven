/* eslint-disable no-undef */
describe('Navigation', () => {
    it('should load the home page', () => {
        cy.visit('/')
        cy.url().should('eq', 'http://localhost:5173/')
    })

    it('should navigate to events page', () => {
        cy.visit('/events')
        cy.url().should('include', '/events')
    })

    it('should navigate to login page', () => {
        cy.visit('/login')
        cy.contains('Sign in to your account').should('exist')
    })

    it('should navigate to register page', () => {
        cy.visit('/register')
        cy.url().should('include', '/register')
    })

    it('should not show venues in navbar for guest', () => {
        cy.visit('/')
        cy.get('nav').should('not.contain', 'Venues')
    })

    it('should show venues in navbar for admin', () => {
        cy.visit('/login')
        cy.get('input[type="email"]').type('admin@gmail.com')
        cy.get('input[type="password"]').type('Admin123')
        cy.get('button[type="submit"]').click()
        cy.wait(2000)
        cy.get('nav').should('contain', 'Venues')
    })
})