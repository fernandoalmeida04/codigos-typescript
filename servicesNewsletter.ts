//Definições de services para o componente de newsletter

import { FormData } from './schema'

const EMAIL_USER_INFO_URL = '/_v/wrapper/api/user/email/userinfo?email='
const SESSION_URL = `/api/sessions?items=*`
const NEWSLETTER_OPTIN_URL = '/_v/wrapper/api/user/newsletteroptin'
const NEWSLETTER_URL = '/_v/wrapper/api/user?userId=true'

/**
 * Fetch backend api and return the user info by its email
 * @param email string
 * @returns Promise<[{ isNewsletterOptIn: boolean }]>
 */
export const verifyUser = async (
  email: string
): Promise<[{ isNewsletterOptIn: boolean }]> => {
  const response = await fetch(`${EMAIL_USER_INFO_URL}${email}`)
  return response.json()
}

/**
 * Returns user session.
 * @returns Promise -
 */
export const getSessionData = async (): Promise<{
  namespaces: { profile: { isAuthenticated: { value: string } } }
}> => {
  const response = await fetch(SESSION_URL)
  return response.json()
}

/**
 * Verify if user is logged by fetching its session
 * @returns Promise boolean
 */
export const isUserLoggedIn = async () => {
  const sessionData = await getSessionData()
  return sessionData?.namespaces?.profile?.isAuthenticated?.value === 'true'
}

/**
 * Patch the current user logged with the newsletter option set as true
 * @returns Promise Response
 */
export const userOptInNewsletter = async () => {
  const options = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isNewsletterOptIn: true }),
  }

  return fetch(NEWSLETTER_OPTIN_URL, options)
}

/**
 * Submit form to the newsletter
 * @param FormData
 * @returns
 */
export const submitFormNewsletter = async (
  dataForm: FormData,
  campaing?: string
) => {
  return fetch(NEWSLETTER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...dataForm, isNewsletterOptIn: true, campaing }),
  })
}
