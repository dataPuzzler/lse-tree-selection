
Cypress.Commands.add("getRegionInputNodeID", (nodeID) => {
    let targetElement;
    cy.get(`#Region-Selection`).find(`input[value=${nodeID}]`).then($input => {
        targetElement = $input
    });
    return targetElement;
});

Cypress.Commands.add("getMuscleInputNodeID", (nodeID) => {
    let targetElement;
    cy.get(`#Muscle-Unit-Selection`).find(`input[value=${nodeID}]`).then($input => {
        targetElement = $input
    });
    return targetElement;
});
