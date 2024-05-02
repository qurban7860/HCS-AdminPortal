import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch } from '../../../redux/store';
import { getCustomer } from '../../../redux/slices/customer/customer';
// components
// import UnderDevelopment from '../../boundaries/UnderDevelopment';
// sections
import CustomerViewForm from './CustomerViewForm';
import CustomerTabContainer from './util/CustomerTabContainer';

// ----------------------------------------------------------------------

export default function CustomerView() {

  const { customerId } = useParams();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(getCustomer(customerId))
  },[ dispatch, customerId ])

  return (
    <Container maxWidth={false}>
      <CustomerTabContainer currentTabValue="customer" />
      <CustomerViewForm />
    </Container>
  );
}
