describe('Visit Vintages', () => {
  before(() => {
    cy.visit('https://vintagesshoponline.com/vintages/ClassicsCollection.aspx')
  })

  it('visited the site', () => {
    const latestRelease = cy
      .get('table.products > tbody')
      .children('tr')
      .eq(1)
      .then((row) => {
        const href = row.children().first().attr('href')
        console.log(href)

        cy.visit(href)
      })
  })
})
