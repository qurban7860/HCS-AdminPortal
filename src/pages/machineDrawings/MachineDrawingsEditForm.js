import { memo } from 'react'
import { Container } from '@mui/system'
import DocumentEditForm from '../documents/DocumentEditForm'
import DocumentCover from '../../components/DocumentForms/DocumentCover';

const MachineDrawingsEditForm = () => (
    <Container maxWidth={false}>
        <DocumentCover content="Edit Machine Drawings" />
      <DocumentEditForm machineDrawings />
    </Container>
  )

export default memo(MachineDrawingsEditForm)