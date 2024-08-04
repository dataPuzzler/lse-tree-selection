describe('User Navigates to Exercise Search Page', () => {
    it('Selection Cockpit is visible', () => {
      cy.visit('/');
      cy.get('lse-tree-selection-container').should('exist')
    });
  });