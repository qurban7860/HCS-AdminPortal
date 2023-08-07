import { memo } from 'react'
import DocumentList from './DocumentList'

const MachineDrawings = () => 
  (
    <DocumentList machineDrawings />
  )


export default memo(MachineDrawings)