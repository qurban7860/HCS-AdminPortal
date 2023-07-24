import { useState } from 'react'
import DocumentList from './DocumentList'

const MachineDrawings = () => {
  const [machineDrawings, setMachineDrawings] = useState(true);
  return (
    <DocumentList machineDrawings={machineDrawings} />
  )
}

export default MachineDrawings