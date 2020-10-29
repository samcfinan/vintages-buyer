import { Page } from 'playwright'
import { PaymentData } from './index'

export const Checkout = async (page: Page, storeID: number, paymentData: PaymentData, submit = false) => {
  // Click on cart
  await Promise.all([page.click('a[href*="ShoppingCart"]'), page.waitForNavigation()])
  // Proceed to shipping page
  await Promise.all([page.click('input[title="PROCEED TO CHECKOUT"]'), page.waitForNavigation()])

  // Select store
  await page.selectOption('select', storeID.toString())

  // Proceed to payment page
  await Promise.all([page.click('input[title="PROCEED TO PAYMENT"]'), page.waitForNavigation()])

  // Payment Fields
  // Card Type
  await page.selectOption('select', { label: paymentData.card_type })
  // Card Number
  await page.fill('input[name*=CCNumber]', paymentData.card_num.toString())
  // CC Expiry Month
  await page.fill('input[name*=ExpiryMonth]', paymentData.card_exp_month.toString())
  // CC Expiry Year
  await page.fill('input[name*=ExpiryYear]', paymentData.card_exp_year.toString())
  // CC Security Code
  await page.fill('input[name*=SecurityCode]', paymentData.card_cvv.toString())

  // Cardholder Name
  await page.fill('input[name*=CCName]', paymentData.cardholder_name)

  // Terms & Conditions
  await page.check('input[name*=CheckBox]')

  if (submit) {
    await page.click('input[value="SUBMIT ORDER"]')
  }
}
