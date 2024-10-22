import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch } from '../../../redux/store';
// slices
import { getPortalRegistration, resetPortalRegistration } from '../../../redux/slices/customer/portalRegistration';
// sections
import PortalRegistrationEditForm from './PortalRegistrationEditForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function CustomerEdit() {

  const dispatch = useDispatch();
  const { customerId } = useParams();

  useLayoutEffect(() => {
    dispatch(getPortalRegistration(customerId));
    return () => dispatch(resetPortalRegistration());
  }, [dispatch, customerId]);

  return (
    <Container maxWidth={false }>
        <StyledCardContainer>
          <Cover name="Portal Registration Request" />
        </StyledCardContainer>
      <PortalRegistrationEditForm />
    </Container>
  );
}
