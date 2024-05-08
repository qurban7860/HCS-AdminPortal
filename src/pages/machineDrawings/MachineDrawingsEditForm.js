import { memo } from 'react'
import { Container, Grid } from '@mui/material'
import DocumentEditForm from '../documents/DocumentEditForm'
import DocumentCover from '../../components/DocumentForms/DocumentCover';

const MachineDrawingsEditForm = () => (
    <Container maxWidth={false}>
      <Grid sx={{mb: 3}} >
        <DocumentCover content="Edit Machine Drawings" />
      </Grid>
      <DocumentEditForm machineDrawings />
    </Container>
  )

export default memo(MachineDrawingsEditForm)