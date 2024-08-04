
beforeEach(() => {
    cy.visit('/');
})

describe('Lse-Tree-Selection', () => {
    it('Selection Cockpit is visible', () => {
      cy.get('lse-tree-selection').should('exist')
    });
});



describe('LSE-Tree-Selection-Node Behaviour', () => {
    it('Clicking on Leaf 21 activates affects its Checkbox', () => {
        let nodeId = 21
        
        const targetInput = cy.getInputGiveNodeID(nodeId)
        targetInput.should("exist")
        targetInput.should("not.be.checked")
        targetInput.should("have.value", 21)
        targetInput.click()
        targetInput.should("be.checked")
    });

    it('Clicking on Leaf 21 activates does not affect its parent', () => {
        let nodeId = 21
        let parentId = 299
        cy.getInputGiveNodeID(parentId).should("exist")
        cy.getInputGiveNodeID(parentId).should("not.be.checked")
        const targetInput = cy.getInputGiveNodeID(nodeId)
        targetInput.click()
        cy.getInputGiveNodeID(parentId).should("not.be.checked")
    }) 
})


