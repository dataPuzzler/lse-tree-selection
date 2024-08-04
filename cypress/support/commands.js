
Cypress.Commands.add("getInputGiveNodeID", nodeID => {
    let targetElement;
    cy.get(`input[value=${nodeID}]`).then($input => {
        targetElement = $input
    });
    return targetElement;
});