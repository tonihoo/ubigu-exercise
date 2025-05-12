describe('Hedgehog Form', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should submit hedgehog form and display the new hedgehog in the list', () => {
    // Create a hedgehog with test data
    const hedgehogName = 'Testi Siili'
    const hedgehogGender = 'Uros'
    const hedgehogAge = '3'

    // Fill in the form
    cy.get('#name').type(hedgehogName)
    cy.get('#age').type(hedgehogAge)
    cy.get('#gender').click()
    cy.get('.MuiMenu-paper').should('be.visible') // Wait for dropdown to appear
    cy.get('.MuiMenuItem-root').contains(hedgehogGender).click()

    // Make sure the map is loaded
    cy.get('.ol-layer canvas').should('be.visible')
      .and('have.attr', 'width').should('not.eq', '0')

    // Click on the OpenLayers map container
    // Using a force: true option since OpenLayers intercepts mouse events
    cy.get('.ol-layer')
      .parent()  // Target the container of the layer
      .click(300, 300, { force: true })
      .wait(500) // Wait for the map click to register in OpenLayers

    // Verify that coordinates are shown
    cy.contains('p', 'Siilin koordinaatit (ETRS-TM35FIN):').should('be.visible')
    // Check that coordinate values are displayed with a regex pattern
    cy.contains('p.MuiTypography-body1', /E \d+, N \d+/).should('be.visible')

    // Submit the form
    cy.get('button[type="submit"]').contains('Tallenna siili').click()

    // Wait longer for form submission in CI environment
    cy.wait(3000)

      // Verify hedgehog details are correctly displayed
    cy.get('body').then($body => {
      // Look for the hedgehog in the list
      cy.get('.MuiMenuItem-root')
        .contains(hedgehogName)
        .should('be.visible')
        .click()
      cy.contains(hedgehogName).should('be.visible')
      cy.contains(hedgehogGender).should('be.visible')
      cy.contains(hedgehogAge).should('be.visible')
      cy.contains('p', 'Sijainti:').should('be.visible')
      cy.contains('p', /E \d+, N \d+/).should('be.visible')
    })
  })
})
