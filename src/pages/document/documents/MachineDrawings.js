import { memo } from 'react'
import { Container } from '@mui/material'
import DocumentList from './DocumentList'

const MachineDrawings = () => 
  (
    <Container maxWidth={false}>
      <DocumentList machineDrawings />
    </Container>
  )


export default memo(MachineDrawings)