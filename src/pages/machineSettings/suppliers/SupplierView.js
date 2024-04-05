import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
// redux
import SupplierViewForm from './SupplierViewForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function SupplierView() {

  const { supplier } = useSelector((state) => state.supplier);

  return (
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={supplier?.name} setting/>
        </StyledCardContainer>
        <SupplierViewForm />
      </Container>
  );
}
