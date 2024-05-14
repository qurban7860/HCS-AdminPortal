// @mui
import { Container, Card } from '@mui/material';
// sections
import ConfigAddForm from './ConfigAddForm';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
// ----------------------------------------------------------------------

export default function RegionAdd() {
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Create Config" icon="mdi:user-circle" />
      </StyledCardContainer>
      <ConfigAddForm />
    </Container>
  );
}
