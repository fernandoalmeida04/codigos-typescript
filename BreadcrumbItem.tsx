//Componente que edita o item do breadcrumb personalizado

import React from 'react'
import { Link } from 'vtex.render-runtime'
import { IconCaret } from 'vtex.store-icons'

import styles from './styles.css'
import { BreadCrumbItemType } from '..'

const BreadCrumbItemText = ({
  text,
  hasArrow,
}: {
  text: string
  hasArrow: boolean
}) => {
  if (!text) return <></>

  if (hasArrow)
    return (
      <>
        <IconCaret
          orientation="right"
          size={8}
          activeClassName={styles.breadCrumbIcon}
        />
        <span className={styles.breadCrumbText}>{text}</span>
      </>
    )
  return <span className={styles.breadCrumbText}>{text}</span>
}

const BreadCrumbItem = ({
  breadCrumbItem,
  hasArrow,
}: {
  breadCrumbItem: BreadCrumbItemType
  hasArrow: boolean
}) => {
  const { text, link } = breadCrumbItem

  if (!link) return <BreadCrumbItemText text={text} hasArrow={hasArrow} />

  return (
    <Link to={link} classname={styles.link}>
      <BreadCrumbItemText text={text} hasArrow={hasArrow} />
    </Link>
  )
}

export default BreadCrumbItem
