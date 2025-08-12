describe('template spec', () => {
  it('passes', () => {
    cy.visit(`${Cypress.config().baseUrl}/app/`)
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.gap-\\[12px\\] > :nth-child(2) > h1').click();
    cy.get('.gap-\\[12px\\] > :nth-child(3) > h1').click();
    cy.get(':nth-child(4) > h1').click();
    cy.get('.gap-\\[12px\\] > :nth-child(1) > h1').click();
    cy.get('.bg-\\[\\#212121\\] > .w-fit > .flex').click();
    cy.get('.relative > .border-\\[1px\\] > :nth-child(1)').click();
    cy.get('.gap-\\[12px\\] > :nth-child(2) > h1').click();
    cy.get('.gap-\\[12px\\] > :nth-child(3) > h1').click();
    cy.get('.gap-\\[12px\\] > :nth-child(4)').click();
    cy.get('.gap-\\[12px\\] > :nth-child(1) > h1').click();
    cy.get('.bg-\\[\\#212121\\] > .w-fit > .flex').click();
    cy.get('.relative > .border-\\[1px\\] > :nth-child(2)').click();
    cy.get('.gap-\\[12px\\] > :nth-child(2) > h1').click();
    cy.get('.gap-\\[12px\\] > :nth-child(3) > h1').click();
    cy.get(':nth-child(4) > h1').click();
    cy.get('.gap-\\[12px\\] > :nth-child(1) > h1').click();
    cy.get('.bg-\\[\\#212121\\] > .w-fit > .flex').click();
    cy.get('.relative > .border-\\[1px\\] > :nth-child(3)').click();
    cy.get('.gap-\\[12px\\] > :nth-child(2) > h1').click();
    cy.get('.gap-\\[12px\\].items-center > .gap-\\[12px\\] > :nth-child(3)').click();
    cy.get(':nth-child(4) > h1').click();
    cy.get('.gap-\\[12px\\] > :nth-child(1) > h1').click();
    cy.get('.bg-\\[\\#212121\\]').click();
    cy.get('.relative > .border-\\[1px\\] > :nth-child(1)').click();
    /* ==== End Cypress Studio ==== */
  })
})
