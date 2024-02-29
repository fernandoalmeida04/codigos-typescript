// Componente criado para renderizar os Label de Energia de produtos eletrónicos

import React, { useState, useEffect, useCallback } from 'react'
import { ProductContext } from 'vtex.product-context'

import style from './styles.css'

const ProductEnergyLabel = (props: any) => {
  const { product }: any = React.useContext(ProductContext) || {}
  const [productProperties, setProductProperties] = useState([])

  const handleClick = useCallback((e: any, linkRef: any) => {
    e.stopPropagation()
    e.preventDefault()
    window.open(linkRef)
  }, [])

  useEffect(() => {
    setProductProperties(product?.properties)
  }, [product])

  return (productProperties &&
    productProperties.find(({ name }: any) =>
      name?.includes(props.fieldImage)
    ) &&
    productProperties.find(({ name }: any) =>
      name?.includes(props.fieldLink1)
    )) ||
    productProperties.find(({ name }: any) =>
      name?.includes(props.fieldLink2)
    ) ? (
    <div className={style.product_energyLabel_container}>
      {productProperties.map((property: any) =>
        property.name === props.fieldLink1 ? (
          <button
            className={style.product_energyLabel_button}
            onClick={(event) => handleClick(event, property?.values[0])}
          >
            {productProperties.map((property2: any) =>
              property2.name === props.fieldImage ? (
                <>
                  <img
                    className={style.product_energyLabel_image}
                    src={property2.values[0]}
                    alt="Flags"
                  />
                </>
              ) : null
            )}
          </button>
        ) : property.name === props.fieldLink2 ? (
          <button
            className={style.product_energyLabel_button}
            onClick={(event) => handleClick(event, property?.values[0])}
          >
            {productProperties.map((property2: any) =>
              property2.name === props.fieldImage ? (
                <>
                  <img
                    className={style.product_energyLabel_image}
                    src={property2.values[0]}
                    alt="Flags"
                  />
                </>
              ) : null
            )}
          </button>
        ) : null
      )}
    </div>
  ) : productProperties &&
    productProperties.find(({ name }: any) =>
      name?.includes(props.fieldImage)
    ) ? (
    <div className={style.product_energyLabel_container}>
      {productProperties.map((property: any) =>
        property.name === props.fieldImage ? (
          <>
            <img
              className={style.product_energyLabel_image}
              src={property.values[0]}
              alt="Flags"
            />
          </>
        ) : null
      )}
    </div>
  ) : null
}

ProductEnergyLabel.defaultProps = {
  fieldLink1: 'energy-label',
  fieldLink2: 'new-energy-label',
  fieldImage: 'EnergyLogo_image',
}

ProductEnergyLabel.schema = {
  title: 'Product Energy Label',
  description: 'Product Characteristics',
  type: 'object',
  properties: {
    fieldLink1: {
      default: ProductEnergyLabel.defaultProps.fieldLink1,
      title: '1st option link field',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    fieldLink2: {
      default: ProductEnergyLabel.defaultProps.fieldLink2,
      title: '2nd option link field',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    fieldImage: {
      default: ProductEnergyLabel.defaultProps.fieldImage,
      title: 'Image Field',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
  },
}

export default ProductEnergyLabel
