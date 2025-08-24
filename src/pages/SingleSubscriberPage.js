import React from 'react'
import { useParams } from 'react-router-dom';
import { useProductsContext } from '../context/products_context'
import { single_product_url as url } from '../utils/constants'
import { formatPrice } from '../utils/helpers'
import {
  Loading,
  Error,
  ProductImages,
  AddToCart,
  Stars,
  PageHero,
  ProfileCardComponent, ProfileCard
} from '../components'
import styled from 'styled-components'


const SingleSubscriberPage = () => {
  const { id } = useParams();
  return <Wrapper>


    {/* <ProfileCardComponent /> */}
    <ProfileCard subscriberId={id} />
  </Wrapper>
}

const Wrapper = styled.main`


`

export default SingleSubscriberPage
