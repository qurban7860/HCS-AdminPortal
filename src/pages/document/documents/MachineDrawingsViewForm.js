import { memo } from 'react'
import DocumentHistoryViewForm from './DocumentHistoryViewForm'

const MachineDrawingsViewForm = () => (
    <DocumentHistoryViewForm machineDrawings />
  )

export default memo(MachineDrawingsViewForm)