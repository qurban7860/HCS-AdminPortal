import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getContact } from '../../../redux/slices/customer/contact';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import ContactEditForm from './ContactEditForm';

// ----------------------------------------------------------------------

export default function ContactEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams();
  // console.log(id);


  const { contact } = useSelector((state) => state.contact);

  useLayoutEffect(() => {
    dispatch(getContact(id));
  }, [dispatch, id]);



  return (
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Contact"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Contact',
              href: PATH_DASHBOARD.contact.list,
            },
            { name: contact?.name },
          ]}
        />
        <ContactEditForm/>
      </Container>
  );
}
