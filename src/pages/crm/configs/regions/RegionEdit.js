// @mui
import { Container, Card } from '@mui/material';
// sections
import RegionEditForm from './RegionEditForm';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function RegionEdit() {

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Edit Region" icon="mdi:user-circle" />
      </StyledCardContainer>
      <RegionEditForm />
    </Container>
  );
}
