import { readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import { chromium } from 'playwright'
import { Checkout } from './checkout'
import { Login } from './login'
import { ProcessPage } from './process_page'

interface Config {
  special_offer_url?: string
  user: {
    email: string
    password: string
  }
  purchases: Wine[]
  store_id: number
  complete_purchase: boolean
  payment: PaymentData
}

interface Wine {
  id: number
  quantity: number
}

export interface PaymentData {
  cardholder_name: string
  card_type: string
  card_num: number
  card_cvv: number
  card_exp_month: number
  card_exp_year: number
}

export interface UserData {
  email: string
  password: string
}

export interface PurchaseMap {
  [keyof: string]: {
    id: string
    quantity: string
  }
}

const config = yaml.safeLoad(readFileSync('./config.yaml', 'utf-8')) as Config

const baseURL = 'https://www.vintagesshoponline.com/vintages'

async function main() {
  const startTime = new Date()

  // Let's put these in a hashmap for performance and normalize the data
  const purchaseMap: PurchaseMap = {}
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

  // Find latest collection, navigate after login
  const latestCollection = await page.$('text=October')
  const firstPage = await latestCollection?.getAttribute('href')

  await Login(page, config.user)

  await page.goto(`${baseURL}/${firstPage}`!, { waitUntil: 'networkidle' })

  const pages = await page.$$('#pagerlist > li > a')
  await ProcessPage(page, purchaseMap)

  for (let i = 2; i <= pages.length; i++) {
    await Promise.all([page.waitForTimeout(750), page.click(`#pagerlist > li > a[aria-label="Page ${i}"]`)])
    await ProcessPage(page, purchaseMap)
  }

  await Checkout(page, config.store_id, config.payment, config.complete_purchase)

  const finish = new Date().getTime() - startTime.getTime()
  const runtime = new Date(finish).getMilliseconds() / 100
  console.log('Runtime:', runtime)
}

main()
