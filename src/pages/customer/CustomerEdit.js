import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// slices
import { getCustomer } from '../../redux/slices/customer/customer';
import { getSites } from '../../redux/slices/customer/site';

// routes
import { PATH_CUSTOMER, PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import CustomerEditForm from './CustomerEditForm';
import CustomerTabContainer from './util/CustomerTabContainer';


// ----------------------------------------------------------------------

export default function CustomerEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams();

  const { customer } = useSelector((state) => state.customer);

  useLayoutEffect(() => {
    dispatch(getCustomer(id));
    dispatch(getSites());
  }, [dispatch, id]);

  return (
    <Container maxWidth={false }>
      <CustomerTabContainer currentTabValue="customer" />
      <CustomerEditForm />
    </Container>
  );
}
