/* eslint-env jest */

const { setupPage } = require('../lib/jest-utilities.js')
const configPaths = require('../config/paths.json')
const PORT = configPaths.testPort

let page
const baseUrl = 'http://localhost:' + PORT

const cookiesPageSelector = '[data-module="app-cookies-page"]'

beforeAll(async () => {
  page = await setupPage()
})

afterAll(async () => {
  await page.close()
})

describe('Cookies page', () => {
  beforeEach(async () => {
    await page.goto(`${baseUrl}/cookies`)
  })

  afterEach(async () => {
    await page.deleteCookie({ name: 'design_system_cookies_policy' })
    await page.setJavaScriptEnabled(true)
  })

  it('without JavaScript it has no visible inputs', async () => {
    await page.setJavaScriptEnabled(false)
    await page.goto(`${baseUrl}/cookies`)

    const isAnalyticsFormGroupHidden = await page.waitForSelector(
      cookiesPageSelector + ' .govuk-form-group input[type="radio"][name="analytics"]', { hidden: true }
    )
    expect(isAnalyticsFormGroupHidden).toBeTruthy()

    const isSaveButtonHidden = await page.waitForSelector(
      cookiesPageSelector + ' button', { hidden: true }
    )
    expect(isSaveButtonHidden).toBeTruthy()
  })

  it('has radios for each cookie type', async () => {
    const isAnalyticsFormGroupVisible = await page.waitForSelector(
      cookiesPageSelector + ' .govuk-form-group input[type="radio"][name="analytics"]', { visible: true }
    )
    expect(isAnalyticsFormGroupVisible).toBeTruthy()
  })

  it('has a save button', async () => {
    const isSaveButtonVisible = await page.waitForSelector(
      cookiesPageSelector + ' button', { visible: true }
    )
    expect(isSaveButtonVisible).toBeTruthy()
  })

  it('has no errors visible when loaded', async () => {
    await expectErrorsToBeHidden(page)
  })

  it('shows errors if the user does not select preferences', async () => {
    await page.click(cookiesPageSelector + ' button')

    await expectErrorsToBeVisible(page)
  })

  it('shows success notification banner after preferences are saved', async () => {
    const isSuccessNotificationHidden = await page.waitForSelector(
      cookiesPageSelector + ' .govuk-notification-banner--success', { hidden: true }
    )
    expect(isSuccessNotificationHidden).toBeTruthy()

    await page.click(cookiesPageSelector + ' input[name="analytics"]')
    await page.click(cookiesPageSelector + ' button')

    const isSuccessNotificationVisible = await page.waitForSelector(
      cookiesPageSelector + ' .govuk-notification-banner--success', { visible: true }
    )
    expect(isSuccessNotificationVisible).toBeTruthy()
  })

  it('hides errors after successful form submission', async () => {
    // Submit form with errors
    await page.click(cookiesPageSelector + ' button')

    await expectErrorsToBeVisible(page)

    // Fix errors and re-submit
    await page.click(cookiesPageSelector + ' input[name="analytics"]')
    await page.click(cookiesPageSelector + ' button')

    await expectErrorsToBeHidden(page)
  })

  it('saves user preferences to a cookie', async () => {
    await page.click(cookiesPageSelector + ' input[name="analytics"][value="yes"]')
    await page.click(cookiesPageSelector + ' button')

    expect(await page.cookies()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'design_system_cookies_policy',
          value: '{"analytics":true,"version":1}'
        })
      ])
    )

    await page.click(cookiesPageSelector + ' input[name="analytics"][value="no"]')
    await page.click(cookiesPageSelector + ' button')

    expect(await page.cookies()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'design_system_cookies_policy',
          value: '{"analytics":false,"version":1}'
        })
      ])
    )
  })

  it('shows the users existing preferences when the page is loaded', async () => {
    await page.click(cookiesPageSelector + ' input[name="analytics"][value="no"]')
    await page.click(cookiesPageSelector + ' button')

    await page.goto(`${baseUrl}/cookies`)

    const isAnalyticsDisagreeSelected = await page.waitForSelector(
      cookiesPageSelector + ' input[name="analytics"][value="no"]:checked', { visible: true }
    )
    expect(isAnalyticsDisagreeSelected).toBeTruthy()

    await page.click(cookiesPageSelector + ' input[name="analytics"][value="yes"]')
    await page.click(cookiesPageSelector + ' button')

    await page.goto(`${baseUrl}/cookies`)

    const isAnalyticsAgreeSelected = await page.waitForSelector(
      cookiesPageSelector + ' input[name="analytics"][value="yes"]:checked', { visible: true }
    )
    expect(isAnalyticsAgreeSelected).toBeTruthy()
  })
})

async function expectErrorsToBeHidden (page) {
  const isErrorSummaryHidden = await page.waitForSelector(
    cookiesPageSelector + ' .govuk-error-summary', { hidden: true }
  )
  expect(isErrorSummaryHidden).toBeTruthy()

  expectErrorMessageToBeHidden(page, 'analytics')
}

async function expectErrorsToBeVisible (page) {
  const isErrorSummaryVisible = await page.waitForSelector(
    cookiesPageSelector + ' .govuk-error-summary', { visible: true }
  )
  expect(isErrorSummaryVisible).toBeTruthy()

  await expectErrorMessageToBeVisible(page, 'analytics')
}

async function expectErrorMessageToBeHidden (page, inputName) {
  const isErrorMessagePresent = await page.waitForSelector(
    cookiesPageSelector + ` .govuk-error-message + .govuk-radios [name="${inputName}"]`, { hidden: true }
  )
  expect(isErrorMessagePresent).not.toBeTruthy()

  const formGroupHasError = await page.waitForSelector(
    cookiesPageSelector + ` .govuk-form-group--error .govuk-radios [name="${inputName}"]`, { hidden: true }
  )
  expect(formGroupHasError).not.toBeTruthy()

  const isFieldsetDescribedByErrorMessage = await page.waitForSelector(
    cookiesPageSelector + ` .govuk-fieldset[aria-describedby~="${inputName}-error"]`, { hidden: true }
  )
  expect(isFieldsetDescribedByErrorMessage).not.toBeTruthy()
}

async function expectErrorMessageToBeVisible (page, inputName) {
  // There should be a link to the input in the error summary
  const isLinkToInputVisible = await page.waitForSelector(
    cookiesPageSelector + ` .govuk-error-summary a[href="#${inputName}"]`, { visible: true }
  )
  expect(isLinkToInputVisible).toBeTruthy()

  const formGroupHasError = await page.waitForSelector(
    cookiesPageSelector + ` .govuk-form-group--error .govuk-radios [name="${inputName}"]`, { visible: true }
  )
  expect(formGroupHasError).toBeTruthy()

  const isErrorMessageVisible = await page.waitForSelector(
    cookiesPageSelector + ` #${inputName}-error.govuk-error-message`, { visible: true }
  )
  expect(isErrorMessageVisible).toBeTruthy()

  // The fieldset should be linked to the message with aria-describedby
  const isFieldsetDescribedByErrorMessage = await page.waitForSelector(
    cookiesPageSelector + ` .govuk-fieldset[aria-describedby~="${inputName}-error"]`, { visible: true }
  )
  expect(isFieldsetDescribedByErrorMessage).toBeTruthy()
}
