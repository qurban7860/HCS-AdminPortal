import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch } from '../../../redux/store';
// slices
import { getCustomer } from '../../../redux/slices/customer/customer';
// import { getSites } from '../../../redux/slices/customer/site';
// sections
import CustomerEditForm from './CustomerEditForm';
import CustomerTabContainer from './util/CustomerTabContainer';


// ----------------------------------------------------------------------

export default function CustomerEdit() {

  const dispatch = useDispatch();

  const { customerId } = useParams();

  useLayoutEffect(() => {
    dispatch(getCustomer(customerId));
  }, [dispatch, customerId]);

  return (
    <Container maxWidth={false }>
      <CustomerTabContainer currentTabValue="customer" />
      <CustomerEditForm />
    </Container>
  );
}
