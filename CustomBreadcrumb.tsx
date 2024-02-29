//Componente criado para auxiliar na criação de breadcrumbs personalizados

import React from 'react'
import styles from './styles.css'
import BreadCrumbItem from './BreadCrumbItem'
export interface BreadCrumbItemType {
  text: string
  link: string
}

interface EditableBreadCrumbType {
  breadCrumbItems: BreadCrumbItemType[]
}

const EditableBreadCrumb = ({ breadCrumbItems }: EditableBreadCrumbType) => {
  return (
    <div className={styles.container}>
      {breadCrumbItems.map(
        (breadCrumbItem: BreadCrumbItemType, index: number) => (
          <BreadCrumbItem
            breadCrumbItem={breadCrumbItem}
            hasArrow={index > 0}
            key={index}
          />
        )
      )}
    </div>
  )
}

EditableBreadCrumb.defaultProps = {
  breadCrumbItems: [
    {
      link: '/',
      text: 'Home',
    },
    {
      link: '/pre-order',
      text: 'Pre Order',
    },
  ],
}

EditableBreadCrumb.schema = {
  title: 'Editable BreadCrumb',
  type: 'object',
  properties: {
    breadCrumbItems: {
      title: 'BreadCrumb Items',
      type: 'array',
      items: {
        title: 'BreadCrumb Item',
        description: 'BreadCrumb Item',
        type: 'object',
        properties: {
          text: {
            title: 'Text',
            type: 'string',
          },
          link: {
            title: 'Link',
            type: 'string',
          },
        },
      },
    },
  },
}

export default EditableBreadCrumb
