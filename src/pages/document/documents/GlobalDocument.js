import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Container } from '@mui/material'
import { resetMachine } from '../../../redux/slices/products/machine';
import DocumentList from './DocumentList'

function GlobalDocument(){

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(resetMachine())
  },[dispatch])

  return (
    <Container maxWidth={false}>
        <DocumentList />
    </Container>
  )
}

export default GlobalDocument