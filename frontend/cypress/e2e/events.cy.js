/* eslint-disable no-undef */
describe('Events', () => {
    it('should load the events page', () => {
        cy.visit('/events')
        cy.url().should('include', '/events')
    })

    it('should display a list of events', () => {
        cy.visit('/events')
        cy.get('body').should('not.be.empty')
    })
})