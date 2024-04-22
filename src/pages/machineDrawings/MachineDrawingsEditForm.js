import { memo } from 'react'
import { Container } from '@mui/system'
import DocumentEditForm from '../documents/DocumentEditForm'

const MachineDrawingsEditForm = () => (
    <Container maxWidth={false}>
      <DocumentEditForm machineDrawings />
    </Container>
  )

export default memo(MachineDrawingsEditForm)