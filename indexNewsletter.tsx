//Componente que cria um form de newsletter personalizado

import type { FormEvent } from 'react'
import React, { useCallback, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { FormattedMessage, useIntl } from 'react-intl'
import { index as RichText } from 'vtex.rich-text'

import styles from './styles.css'
import type { Props, FormData } from './schema'
import { defaultProps, schema } from './schema'
import {
  isUserLoggedIn,
  submitFormNewsletter,
  userOptInNewsletter,
  verifyUser,
} from './services'

interface WindowGTM extends Window {
  dataLayer: any
}

const INITIAL_DATA: FormData = {
  firstName: '',
  lastName: '',
  email: '',
}

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i

const Newsletter = ({ hide, variant, campaing, redirectOnSubmit }: Props) => {
  const [displayMore, setDisplayMore] = useState(false)

  const [values, setValues] = useState<FormData>(INITIAL_DATA)
  const [errors, setErrors] = useState<FormData>({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState(false)

  const { navigate, query } = useRuntime()
  const intl = useIntl()

  const onRegisterSuccessfully = useCallback(() => {
    setSuccess(true)
    if (redirectOnSubmit) {
      setTimeout(() => {
        navigate({
          to: '/',
        })
      }, 3000)
    }
  }, [navigate, redirectOnSubmit])

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setErrors({})

      let hasError = false

      Object.keys(values).forEach((key) => {
        const item = values[key as keyof FormData]

        if (key === 'email' && !item?.match(EMAIL_REGEX)) {
          setErrors((err) => ({
            ...err,
            [key]: intl.formatMessage({
              id: 'store/newsletter.formInputEmailError',
            }),
          }))
          hasError = true
        }

        if (item?.length === 0) {
          setErrors((err) => ({
            ...err,
            [key]: intl.formatMessage({
              id: 'store/newsletter.formInputError',
            }),
          }))
          hasError = true
        }
      })

      // eslint-disable-next-line vtex/prefer-early-return
      if (!hasError) {
        setLoading(true)

        // Verify if user have already subscribed to the newsletter
        const userEmailVerify = await verifyUser(values.email!)

        if (userEmailVerify.length > 0) {
          const [mdUser] = userEmailVerify

          // If user is already subscribed, stop and redirect.
          if (mdUser.isNewsletterOptIn) {
            onRegisterSuccessfully()
            setLoading(false)

            return
          }

          // Verify if user is logged.
          const userLoggedIn = await isUserLoggedIn()

          if (!userLoggedIn) {
            setLoading(false)
            setErrors((err) => ({
              ...err,
              email: intl.formatMessage({
                id: 'store/newsletter.emailAlreadyInUseLabel',
              }),
            }))

            return
          }

          // Submituser newsletter optIn
          const response = await userOptInNewsletter()

          if (response.status !== 200) {
            setLoading(false)
            setError(
              intl.formatMessage({
                id: 'store/newsletter.failedError',
              })
            )

            return
          }

          onRegisterSuccessfully()

          return
        }

        // const campaing =

        const resp = await submitFormNewsletter(
          values,
          query.campaign || campaing
        )

        if (resp.status !== 200) {
          setError(
            intl.formatMessage({
              id: 'store/newsletter.emailAlreadyInUseLabel',
            })
          )
          setLoading(false)
        } else {
          window.dispatchEvent(new CustomEvent('custom:newsletterSubmit'))
          const dl = (window as unknown as WindowGTM).dataLayer || []
          setValues(INITIAL_DATA)
          setLoading(false)
          onRegisterSuccessfully()
          dl.push({
            event: 'lead',
            newsletter_interaction: variant,
            email: values.email,
          })
        }
      }
    },
    [values, intl, query.campaign, campaing, onRegisterSuccessfully]
  )

  if (hide) return null

  if (success) {
    return (
      <div className={styles.newsletterSuccessWrapper}>
        <h2>
          <FormattedMessage id="store/newsletter.successTitle" />
        </h2>
        <p>
          <FormattedMessage id="store/newsletter.successBody" />
        </p>
        {redirectOnSubmit && (
          <FormattedMessage id="store/newsletter.successRedirectMessage" />
        )}
      </div>
    )
  }

  return (
    <div
      className={`${styles.newsletterWrapper} ${
        variant === 'popup' && styles.newsletterPopupWrapper
      } ${variant === 'banner' && styles.newsletterBannerWrapper}`}
    >
      <form onSubmit={onSubmit}>
        <div className={styles.newsletterInfoWrapper}>
          <div className={styles.newsletterTitleContent}>
            <div className={styles.newsletterTitleWrapper}>
              <h2>
                <FormattedMessage id="store/newsletter.title" />
                {variant === 'banner' && (
                  <span>
                    <FormattedMessage id="store/newsletter.requiredFieldLabel" />
                  </span>
                )}
              </h2>
              {variant !== 'banner' && (
                <h3>
                  <FormattedMessage id="store/newsletter.subTitle" />
                </h3>
              )}
            </div>
          </div>
          <div className={styles.newsletterInputContent}>
            <div className={styles.newsletterInputWrapper}>
              <div>
                <input
                  name="firstName"
                  disabled={loading}
                  value={values.firstName}
                  onChange={(e) => {
                    const { value } = e.target

                    setValues((val) => ({ ...val, firstName: value }))
                  }}
                  className={errors.firstName && styles.inputError}
                  placeholder={intl.formatMessage({
                    id: 'store/newsletter.formLabelFirstName',
                  })}
                  required
                />
                {errors.firstName && (
                  <small style={{ color: 'red' }}>{errors.firstName}</small>
                )}
              </div>
              <div>
                <input
                  name="lastName"
                  value={values.lastName}
                  disabled={loading}
                  onChange={(e) => {
                    const { value } = e.target

                    setValues((val) => ({ ...val, lastName: value }))
                  }}
                  className={errors.lastName && styles.inputError}
                  placeholder={intl.formatMessage({
                    id: 'store/newsletter.formLabelLastName',
                  })}
                  required
                />
                {errors.lastName && (
                  <small style={{ color: 'red' }}>{errors.lastName}</small>
                )}
              </div>
              <div>
                <input
                  name="email"
                  value={values.email}
                  type="email"
                  disabled={loading}
                  onChange={(e) => {
                    const { value } = e.target

                    setValues((val) => ({ ...val, email: value }))
                  }}
                  className={errors.email && styles.inputError}
                  placeholder={intl.formatMessage({
                    id: 'store/newsletter.formLabelEmail',
                  })}
                  required
                />
                {errors.email && (
                  <small style={{ color: 'red' }}>{errors.email}</small>
                )}
              </div>
            </div>

            {variant === 'page' ? (
              <div className={styles.newsletterErrorWrapper}>
                {error && (
                  <span className={styles.newsletterError}>{error}</span>
                )}
                <span>
                  <RichText
                    text={intl.formatMessage({
                      id: 'store/newsletter.formLabel',
                    })}
                  />
                </span>
              </div>
            ) : (
              <div id="empty" />
            )}

            <div className={styles.newsletterCheckWrapper}>
              {(variant === 'banner' || variant === 'popup') && (
                <div className={styles.newsletterErrorBannerWrapper}>
                  {error && (
                    <span className={styles.newsletterError}>{error}</span>
                  )}
                  <span>
                    <RichText
                      text={intl.formatMessage({
                        id: 'store/newsletter.formLabel',
                      })}
                    />
                  </span>
                </div>
              )}

              <div className={styles.newsletterCheckbox}>
                <input
                  name="legalDisclaimer"
                  className={errors.disclaimer && styles.inputError}
                  type="checkbox"
                  required
                  disabled={loading}
                />
                <div
                  className={`${displayMore ? styles.offLines : ''} ${
                    styles.paragraph
                  }`}
                >
                  <RichText
                    text={intl.formatMessage({
                      id: 'store/newsletter.formLegalDisclaimer',
                    })}
                  />

                  {!displayMore && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDisplayMore(!displayMore)
                      }}
                    >
                      <FormattedMessage id="store/newsletter.readMore" />
                    </button>
                  )}

                  {displayMore && (
                    <RichText
                      text={intl.formatMessage({
                        id: 'store/newsletter.legalDisclaimerMore',
                      })}
                    />
                  )}

                  {displayMore && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDisplayMore(!displayMore)
                      }}
                    >
                      <FormattedMessage id="store/newsletter.readLess" />
                    </button>
                  )}
                </div>
              </div>

              {errors.disclaimer && (
                <small style={{ color: 'red' }}>{errors.disclaimer}</small>
              )}
            </div>
          </div>
        </div>
        <div className={styles.newsletterActionWrapper}>
          <button disabled={loading} type="submit">
            <img
              src="https://emeabesttemplatewhirlpool.vteximg.com.br/arquivos/Email.svg"
              alt="submit form"
            />
            <FormattedMessage id="store/newsletter.submitButtonText" />
          </button>

          <span>
            <FormattedMessage id="store/newsletter.requiredFieldLabel" />
          </span>
        </div>
      </form>
    </div>
  )
}

Newsletter.defaultProps = defaultProps

Newsletter.schema = schema

export default Newsletter
