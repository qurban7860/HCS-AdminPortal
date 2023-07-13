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

// ----------------------------------------------------------------------

export default function CustomerEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams();
  // console.log(id);

  const { customer } = useSelector((state) => state.customer);

  useLayoutEffect(() => {
    dispatch(getCustomer(id));
    dispatch(getSites());
    // dispatch(getContacts());
  }, [dispatch, id]);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Customer"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          {
            name: 'Customer',
            href: PATH_CUSTOMER.list,
          },
          { name: customer?.name },
        ]}
      />

      <CustomerEditForm />
    </Container>
  );
}
