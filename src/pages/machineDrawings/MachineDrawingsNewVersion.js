import { memo } from 'react'
import { Container } from '@mui/material'
import DocumentAddForm from '../documents/DocumentAddForm'

const MachineDrawingsNewVersion = () => (
  <Container maxWidth={false} >
    <DocumentAddForm machineDrawings historyNewVersion />
  </Container>
  )

export default memo(MachineDrawingsNewVersion)