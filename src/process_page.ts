import type { PurchaseMap } from './index'
import { Page } from 'playwright'

export const ProcessPage = async (page: Page, purchaseMap: PurchaseMap) => {
  const tableRows = await page.$$('tbody > tr')

  let numAdded = 0

  for (const row of tableRows) {
    const rowData = await row.$$('td')
    // Skip table rows
    if (rowData.length < 4) {
      continue
    }

    const idNode = await rowData[1].$('span')
    const id = await idNode?.innerText()!

    // Grab purchase data for wine
    const purchaseData = purchaseMap[id]

    // Skip wines not in purchase config file
    if (!purchaseData) {
      continue
    }

    const available = await rowData[6].innerText()
    if (available === '0') {
      continue
    }

    const quantityInput = await rowData[7].$('input')
    await quantityInput?.fill(purchaseData.quantity)
    numAdded += 1
  }

  if (numAdded > 0) {
    await page.click('input[value="ADD TO CART"]')
  }
}
