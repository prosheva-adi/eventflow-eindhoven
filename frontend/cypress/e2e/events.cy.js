/* eslint-disable no-undef */
describe('Events', () => {
    it('should load the events page', () => {
        cy.visit('http://localhost:5173/events')
        cy.url().should('include', '/events')
    })

    it('should display a list of events', () => {
        cy.visit('http://localhost:5173/events')
        cy.get('body').should('not.be.empty')
    })
})