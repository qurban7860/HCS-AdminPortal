// @mui
import { Container, Card } from '@mui/material';
// sections
import RegionAddForm from './RegionAddForm';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
// ----------------------------------------------------------------------

export default function RegionAdd() {
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Create Region" icon="mdi:user-circle" />
      </StyledCardContainer>
      <RegionAddForm />
    </Container>
  );
}
