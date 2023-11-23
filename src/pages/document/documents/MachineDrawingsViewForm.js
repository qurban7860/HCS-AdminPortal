import { memo } from 'react'
import { Container } from '@mui/system'
import DocumentHistoryViewForm from './DocumentHistoryViewForm'

const MachineDrawingsViewForm = () => (
    <Container maxWidth={false}>
      <DocumentHistoryViewForm machineDrawings />
    </Container>
  )

export default memo(MachineDrawingsViewForm)