// @mui
import { Container, Card } from '@mui/material';
// sections
import ConfigEditForm from './ConfigEditForm';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function RegionEdit() {

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Edit Config" icon="mdi:user-circle" />
      </StyledCardContainer>
      <ConfigEditForm />
    </Container>
  );
}
