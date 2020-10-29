import { Page } from 'playwright'
import { UserData } from '.'

export const Login = async (page: Page, userData: UserData) => {
  await Promise.all([page.click('text=Sign In'), page.waitForNavigation()])

  const emailInput = await page.$('div.framework-column > input.framework-control')
  await emailInput?.fill(userData.email)

  const passwordInput = await page.$('div.framework-column > div.inputtogglewrap > input')
  await passwordInput?.fill(userData.password)

  await Promise.all([page.click('input[value="SIGN IN"]'), page.waitForNavigation()])
}
