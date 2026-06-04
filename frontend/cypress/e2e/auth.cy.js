/* eslint-disable no-undef */
describe('Auth', () => {
  it('should load the login page', () => {
    cy.visit('/login')
    cy.contains('Sign in to your account').should('exist')
  })


  it('should show error with invalid credentials', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('wrong@test.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.contains('Invalid email or password.').should('be.visible')
  })
})