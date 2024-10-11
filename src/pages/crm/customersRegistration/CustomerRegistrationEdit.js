import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// slices
import { getCustomerRegistration } from '../../../redux/slices/customer/customerRegistration';
// sections
import CustomerRegistrationEditForm from './CustomerRegistrationEditForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function CustomerEdit() {
  const { customerRegistration } = useSelector( (state) => state.customerRegistration );
  const dispatch = useDispatch();

  const { customerId } = useParams();

  useLayoutEffect(() => {
    dispatch(getCustomerRegistration(customerId));
  }, [dispatch, customerId]);

  return (
    <Container maxWidth={false }>
        <StyledCardContainer>
          <Cover name={ customerRegistration?.customerName || ""} />
        </StyledCardContainer>
      <CustomerRegistrationEditForm />
    </Container>
  );
}
