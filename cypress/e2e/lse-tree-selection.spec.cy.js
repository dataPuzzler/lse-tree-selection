beforeEach(() => {
    cy.visit('/');
})

afterEach(() => {
    // cy.wait(2000)
})



describe('Lse-Tree-Selection', () => {
    it('Selection Cockpit is visible', () => {
      cy.get('lse-tree-selection').should('exist')
    });
});


describe('Node Selection View-Behaviour', () => {
    /*
    it("Showcase Clicking Behaviour -> Leading to Full Selection and finally to Full Unselection again", () =>{
        let topLevelRegionID = 19999
        let topLevelMuscleID = 30
        cy.getRegionInputNodeID(199).focus().wait(333).click().wait(2000)
        cy.getRegionInputNodeID(299).focus().wait(333).click().wait(2000)
        cy.getRegionInputNodeID(599).focus().wait(333).click().wait(2000)
        cy.getRegionInputNodeID(topLevelRegionID).should("be.checked")
        cy.getMuscleInputNodeID(topLevelMuscleID).focus().wait(333).click().wait(2000)
        cy.getMuscleInputNodeID(topLevelMuscleID).should("be.checked")
        cy.getRegionInputNodeID(1999).focus().wait(333).click().wait(2000)
        cy.getRegionInputNodeID(5999).focus().wait(333).click().wait(2000)
        cy.getRegionInputNodeID(topLevelRegionID).should("not.be.checked")
        cy.getMuscleInputNodeID(20).focus().wait(333).click().wait(2000)
        cy.getMuscleInputNodeID(10).focus().wait(333).click()
        cy.getMuscleInputNodeID(topLevelMuscleID).should("not.be.checked")
    });
    */

    
    it('Clicking on Leaf 21 of Region Selection activates affects its Checkbox and not its parent', () => {
        let nodeId = 21
        let parentID = 299
        const targetInput = cy.getRegionInputNodeID(nodeId)
        targetInput.should("exist")
        targetInput.should("not.be.checked")
        targetInput.should("have.value", 21)
        targetInput.focus().wait(333).click()
        targetInput.should("be.checked")
        cy.getRegionInputNodeID(parentID).should("not.be.checked")
    });

    it('Clicking on Leaf 21 of Muscle Selection activates affects its Checkbox and not its parent', () => {
        let nodeId = 21
        let parentID = 20
        const targetInput = cy.getMuscleInputNodeID(nodeId)
        targetInput.should("exist")
        targetInput.should("not.be.checked")
        targetInput.should("have.value", 21)
        targetInput.focus().wait(333).click()
        targetInput.should("be.checked")
        cy.getMuscleInputNodeID(parentID).should("not.be.checked")
    });
    

    it('Clicking on Region Leaves 21 and 22 activates parent also', () => {
        let parentId = 299
        let childIds = [21,22]
        childIds.forEach(
            (childId)  => cy.getRegionInputNodeID(childId).focus().wait(333).click()
        )
        cy.getRegionInputNodeID(parentId).should("be.checked")
    });

    it('Clicking on Muscle Leaves 21 and 22 activates parent also', () => {
        let parentId = 20
        let childIds = [21,22]
        childIds.forEach(
            (childId)  => cy.getMuscleInputNodeID(childId).focus().wait(333).click()
        )
        cy.getMuscleInputNodeID(parentId).should("be.checked")
    });

    it('Clicking on Parent 5999 activates it and all sub nodes', () => {
        let parentID = 5999
        let subNodeIds = [599, 232]
        let parentNode = cy.getRegionInputNodeID(5999)
        parentNode.should("exist")
        parentNode.focus().wait(333).click()
        parentNode.should("be.checked")
        subNodeIds.forEach(subNodeId => {
            cy.getRegionInputNodeID(subNodeId).should("be.checked");
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
        cy.getRegionInputNodeID(11).focus().wait(333).click()
    });

    
    it("Selecting Mid-Tier Node 1999 should dispatch bubbling event with correct selection ids array", () => {
        cy.get("#app").should("exist");
        cy.window().then((win) => {
            win.document.getElementById("app").addEventListener("lse-tree-selection-change", e => {
                expect(e.detail).to.have.property("selected_ids").that.is.an("array")
                expect(e.detail.selected_ids).to.deep.equal([10,11,12,21,22])
            })
        });
        cy.getRegionInputNodeID(1999).focus().wait(333).click()
    });
    
});


