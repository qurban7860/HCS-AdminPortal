import React from 'react'
import { Container } from '@mui/material'
import DocumentList from './DocumentList'


function GlobalDocument(){
  return (
    <Container maxWidth={false}>
        <DocumentList />
    </Container>
  )
}

export default GlobalDocument