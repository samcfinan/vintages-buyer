import { readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import { chromium } from 'playwright'

const config = yaml.safeLoad(readFileSync('./purchases.yaml', 'utf-8'))

async function main() {
  const browser = await chromium.launch({ headless: false })

  const page = await browser.newPage()
  await page.goto('https://www.vintagesshoponline.com/vintages/ClassicsCollection.aspx')
  await page.click('text=October')
  document.querySelectorAll('')
}

main()
