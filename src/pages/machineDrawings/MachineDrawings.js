import { memo, useEffect } from 'react'
import { useDispatch } from 'react-redux';

import { Container } from '@mui/material'
import { resetMachine } from '../../redux/slices/products/machine';
import DocumentList from '../documents/DocumentList'

const MachineDrawings = () =>{

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(resetMachine())
  },[dispatch])

  return(
    <Container maxWidth={false}>
      <DocumentList machineDrawings />
    </Container>
  )
} 

export default memo(MachineDrawings)