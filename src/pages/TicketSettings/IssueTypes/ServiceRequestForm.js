import { React } from 'react';
import { Container } from '@mui/material';
// components
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

export default function ServiceRequestForm() {
  return (
  <Container maxWidth={false}>
    <StyledCardContainer>
      <Cover name="Service Request" ticketSettings/>
    </StyledCardContainer>
  </Container>
  )
}
