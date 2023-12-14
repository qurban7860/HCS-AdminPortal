import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {
  Card,
  Grid,
  Container,
  Link,
  Tabs,
} from '@mui/material';
// routes
import { PATH_SECURITY } from '../../routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// _mock_
import {
  getSecurityUser,
  setSecurityUserEditFormVisibility,
} from '../../redux/slices/securityUser/securityUser';
// components
import ViewFormField from '../components/ViewForms/ViewFormField';
import ViewFormAudit from '../components/ViewForms/ViewFormAudit';
import { getCustomer , setCustomerDialog } from '../../redux/slices/customer/customer';
import { getContact , setContactDialog } from '../../redux/slices/customer/contact';
import { Cover } from '../components/Defaults/Cover';
import LogoAvatar from '../../components/logo-avatar/LogoAvatar';
import CustomAvatar from '../../components/custom-avatar/CustomAvatar';
import ViewFormEditDeleteButtons from '../components/ViewForms/ViewFormEditDeleteButtons';
import CustomerDialog from '../components/Dialog/CustomerDialog';
import ContactDialog from '../components/Dialog/ContactDialog';

// ----------------------------------------------------------------------

export default function SecurityUserProfile() {
  // const { customer } = useSelector((state) => state.customer);
  // const { contact } = useSelector((state) => state.contact);
  const { securityUser, initial } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const userId = localStorage.getItem('userId');
  const [currentTab, setCurrentTab] = useState('profile');

  useEffect(() => {
    if (userId) {
      dispatch(getSecurityUser(userId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userId, initial]);

  useEffect(() => {
    dispatch(setCustomerDialog(false));
    dispatch(setContactDialog(false));
  }, [dispatch]);

  const handleCustomerDialog = (event) =>{
    event.preventDefault();
    dispatch(setCustomerDialog(true))
    if (userId && securityUser?.customer?._id) {
      dispatch(getCustomer(securityUser?.customer?._id));
    }
  }

  const handleContactDialog = (event) =>{
    event.preventDefault();
    dispatch(setContactDialog(true))
    if (userId && securityUser?.contact?._id) {
      dispatch(getContact(securityUser?.customer?._id, securityUser?.contact?._id));
    }
  }

  const handleEdit = () => {
    // dispatch(setSecurityUserEditFormVisibility(true));
    navigate(PATH_SECURITY.users.editProfile);
  };

  const defaultValues = useMemo(
    () => ({
      customer: securityUser?.customer?.name || '',
      contact: securityUser?.contact?.firstName || '',
      name: securityUser?.name || '',
      phone: securityUser?.phone || '',
      email: securityUser?.email || '',
      login: securityUser?.login || '',
      roles: securityUser?.roles || [],
      regions: securityUser?.regions || [],
      countries: securityUser?.regions ? securityUser.regions.flatMap(region => region.countries) : [],
      customers: securityUser?.customers || [],
      machines: securityUser?.machines || [],
      isActive: securityUser?.isActive || false,
      createdByFullName: securityUser?.createdBy?.name || '',
      createdAt: securityUser?.createdAt || '',
      createdIP: securityUser?.createdIP || '',
      updatedByFullName: securityUser?.updatedBy?.name || '',
      updatedAt: securityUser?.updatedAt || '',
      updatedIP: securityUser?.updatedIP || '',
    }),
    [securityUser]
  );
  return (
    <>
      <Container maxWidth={false}>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
          }}
        >
          <Cover
            name={defaultValues?.name}
            photoURL={user.name === 'HOWICK LTD.' ? <LogoAvatar /> : <CustomAvatar />}
            icon="ph:users-light"
          />

          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              position: 'absolute',
              bgcolor: 'background.paper',
              '& .MuiTabs-flexContainer': {
                pr: { md: 3 },
                justifyContent: {
                  sm: 'center',
                  md: 'flex-end',
                },
              },
            }}
          >
            {/* {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))} */}
          </Tabs>
        </Card>
        <Card sx={{ p: 3 }}>
          <ViewFormEditDeleteButtons handleEdit={handleEdit} />
          <Grid container>
            <ViewFormField
              sm={6}
              heading="Customer"
              objectParam={
                defaultValues?.customer && (
                  <Link onClick={ handleCustomerDialog } href="#" underline="none">
                    {defaultValues?.customer}
                  </Link>
                )
              }
            />
            <ViewFormField
              sm={6}
              heading="Contact"
              objectParam={
                defaultValues?.contact && (
                  <Link onClick={ handleContactDialog } href="#" underline="none">
                    {defaultValues?.contact}
                  </Link>
                )
              }
            />
            <ViewFormField sm={6} heading="Full Name" param={defaultValues?.name} />
            <ViewFormField sm={6} heading="Phone" param={defaultValues?.phone} />
            <ViewFormField sm={12} heading="email" param={defaultValues?.email} />
            <ViewFormField sm={6} heading="Login" param={defaultValues?.login} />
            <ViewFormField
              sm={6}
              heading="Roles"
              userRolesChips={defaultValues?.roles}
            />
            <ViewFormField
              sm={12}
              heading="Regions"
              arrayParam={defaultValues?.regions}
            />
            <ViewFormField
              sm={12}
              heading="Countries"
              chipLabel='country_name'
              arrayParam={defaultValues?.countries}
            />
            <ViewFormField
              sm={12}
              heading="Customers"
              arrayParam={defaultValues?.customers}
            />
            <ViewFormField
              sm={12}
              heading="Machines"
              arrayParam={defaultValues?.machines}
            />
          </Grid>
          <ViewFormField />
          <Grid container>
            <ViewFormAudit defaultValues={defaultValues} />
          </Grid>
        </Card>
      </Container>

      <CustomerDialog />
      <ContactDialog />

    </>
  );
}
