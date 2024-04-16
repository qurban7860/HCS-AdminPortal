import { memo } from 'react'
import DocumentAddForm from '../documents/DocumentAddForm'

const MachineDrawingsNewVersion = () => (
    <DocumentAddForm machineDrawings historyNewVersion />
  )

export default memo(MachineDrawingsNewVersion)