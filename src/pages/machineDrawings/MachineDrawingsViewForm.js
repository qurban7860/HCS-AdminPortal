import { memo } from 'react'
import { Container } from '@mui/system'
import DocumentHistoryViewForm from '../documents/DocumentHistoryViewForm'

const MachineDrawingsViewForm = () => (
    <Container maxWidth={false}>
      <DocumentHistoryViewForm machineDrawings />
    </Container>
  )

export default memo(MachineDrawingsViewForm)