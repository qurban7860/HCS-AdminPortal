import { memo } from 'react'
import DocumentAddForm from '../documents/DocumentAddForm'

const MachineDrawingsAddFiles = () => (
    <DocumentAddForm machineDrawings historyAddFiles />
  )

export default memo(MachineDrawingsAddFiles)