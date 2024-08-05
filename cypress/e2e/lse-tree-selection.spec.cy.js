
beforeEach(() => {
    cy.visit('/');
    
})

afterEach(() => {
    cy.wait(2000)
})

describe('Lse-Tree-Selection', () => {
    it('Selection Cockpit is visible', () => {
      cy.get('lse-tree-selection').should('exist')
    });
});



describe('Node Selection View-Behaviour', () => {
    it('Clicking on Leaf 21 activates affects its Checkbox', () => {
        let nodeId = 21
        
        const targetInput = cy.getInputGiveNodeID(nodeId)
        targetInput.should("exist")
        targetInput.should("not.be.checked")
        targetInput.should("have.value", 21)
        targetInput.focus().wait(500).click()
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
    });

    it('Clicking on Leafes 21 and 22 activates parent also', () => {
        let parentId = 299
        let childIds = [21,22]
        childIds.forEach(
            (childId)  => cy.getInputGiveNodeID(childId).click()
        )
        cy.getInputGiveNodeID(parentId).should("be.checked")
    });

    it('Clicking on Parent 5999 activates it and all sub nodes', () => {
        let parentID = 5999
        let subNodeIds = [599, 232]
        let parentNode = cy.getInputGiveNodeID(5999)
        parentNode.should("exist")
        parentNode.focus().wait(1000).click()
        parentNode.should("be.checked")
        subNodeIds.forEach(subNodeId => {
            cy.getInputGiveNodeID(subNodeId).should("be.checked");
        })

    });
});

describe('Node Selection Event-Trigger behaviour', () => {
    it("Selecting Leaf Node 11 should dispatch bubbling event with correct selection ids array", () => {
        cy.get("#app").should("exist");
        cy.window().then((win) => {
            win.document.getElementById("app").addEventListener("lse-tree-selection-change", e => {
                expect(e.detail).to.have.property("selected_ids").that.is.an("array")
                expect(e.detail.selected_ids).to.deep.equal([11])
            })
        });
        cy.getInputGiveNodeID(11).click();
    });

    it("Selecting Mid-Tier Node 1999 should dispatch bubbling event with correct selection ids array", () => {
        cy.get("#app").should("exist");
        cy.window().then((win) => {
            win.document.getElementById("app").addEventListener("lse-tree-selection-change", e => {
                expect(e.detail).to.have.property("selected_ids").that.is.an("array")
                expect(e.detail.selected_ids).to.deep.equal([10,11,12,21,22])
            })
        });
        cy.getInputGiveNodeID(1999).click();
    });
});




