import { memo } from 'react'
import { Container } from '@mui/material'
import MachineLogsViewForm from '../machine/logs/MachineLogsViewForm'

const LogsViewForm = () => (
    <Container maxWidth={false}>
      <MachineLogsViewForm machineDrawings />
    </Container>
  )

export default memo(LogsViewForm)