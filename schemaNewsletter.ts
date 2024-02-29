//Schemas para o componente de newsletter

export interface FormData {
  firstName?: string
  lastName?: string
  email?: string
  disclaimer?: string
}

export interface Props {
  hide: boolean
  variant?: 'page' | 'popup' | 'banner'
  redirectOnSubmit?: boolean
  campaing?: string
}

export const defaultProps: Props = {
  hide: false,
  variant: 'page',
  redirectOnSubmit: false,
  campaing: undefined,
}

export const schema = {
  title: 'Newsletter',
  type: 'object',
  properties: {
    hide: {
      title: 'Hide component on current page',
      default: defaultProps.hide,
      type: 'boolean',
    },
    redirectOnSubmit: {
      title: 'Redirect after submit form',
      default: defaultProps.redirectOnSubmit,
      type: 'boolean',
    },
    variant: {
      title: 'Component layout variant',
      default: defaultProps.variant,
      description: 'page, banner or popup',
      type: 'string',
    },
    campaing: {
      title: 'Campaing id',
      type: 'string',
    },
  },
}
