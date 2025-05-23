context('Basic', () => {
  const baseUrl = `http://localhost:3333${import.meta.env.VITE_BASE_URL}`

  beforeEach(() => {
    cy.visit('/')
  })

  it('basic nav', () => {
    cy.url()
      .should('eq', `${baseUrl}`)
  })

  it('home', () => {
    cy.get('[data-test-id="home"]')
      .should('exist')
    cy.get('[data-test-id="home"]')
      .click()
    cy.url()
      .should('eq', `${baseUrl}`)
  })

  it('markdown', () => {
    cy.get('[data-test-id="about"]')
      .click()
      .url()
      .should('eq', `${baseUrl}about`)

    cy.get('.shiki')
      .should('exist')
  })
})
