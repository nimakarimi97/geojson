context('Basic', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('basic nav', () => {
    cy.url()
      .should('eq', 'http://localhost:3333/')
  })

  it('markdown', () => {
    cy.get('[data-test-id="about"]')
      .click()
      .url()
      .should('eq', 'http://localhost:3333/about')

    cy.get('.shiki')
      .should('exist')
  })
})
