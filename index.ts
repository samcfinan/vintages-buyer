import { readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import { chromium } from 'playwright'

interface Config {
  special_offer_url?: string
  purchases: WineToPurchase[]
  payment: {
    card_num: number
    card_cvv: number
    card_exp: string
  }
}

interface WineToPurchase {
  id: number
  quantity: number
}

const config = yaml.safeLoad(readFileSync('./purchases.yaml', 'utf-8')) as Config

const baseURL = 'https://www.vintagesshoponline.com/vintages'

async function main() {
  // Let's put these in a hashmap for performance and normalize the data
  const purchaseMap: { [keyof: string]: { id: string; quantity: string } } = {}
  config.purchases.map((wine) => {
    const paddedWineID = wine.id.toString().padStart(7, '0')

    purchaseMap[paddedWineID] = {
      id: paddedWineID,
      quantity: wine.quantity.toString(),
    }
  })

  console.log(purchaseMap)

  const browser = await chromium.launch({ headless: false })

  // Go to Classics Collection
  const page = await browser.newPage()
  await page.goto(`${baseURL}/ClassicsCollection.aspx`, { waitUntil: 'networkidle' })

  // Find latest collection, navigate to page
  const latestCollection = await page.$('text=October')
  const link = await latestCollection?.getAttribute('href')
  await page.goto(`${baseURL}/${link}`!, { waitUntil: 'networkidle' })

  const tableRows = await page.$$('tbody > tr')

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

    const quantityInput = await rowData[7].$('input')
    await quantityInput?.fill(purchaseData.quantity)
  }

  // for await (const row of tableRows) {
  //   const cells = await row.$$eval('td', (item) => {})
  //   cells.map(async (c) => {
  //     console.log(await c.innerHTML())
  //   })
  // }
}

main()
