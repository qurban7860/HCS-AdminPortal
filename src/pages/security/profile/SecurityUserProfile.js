import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {
  Card,
  Grid,
  Container,
  Link,
  Chip,
} from '@mui/material';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// _mock_
import {
  getSecurityUser
} from '../../../redux/slices/securityUser/securityUser';
// components
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import { getCustomer , setCustomerDialog } from '../../../redux/slices/customer/customer';
import { getContact , setContactDialog } from '../../../redux/slices/customer/contact';
import { Cover } from '../../../components/Defaults/Cover';
import LogoAvatar from '../../../components/logo-avatar/LogoAvatar';
import CustomAvatar from '../../../components/custom-avatar/CustomAvatar';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function SecurityUserProfile() {
  // const { customer } = useSelector((state) => state.customer);
  // const { contact } = useSelector((state) => state.contact);
  const { securityUser, initial } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userId } = useAuthContext();

  useEffect(() => {
    if (userId) {
      dispatch(getSecurityUser(userId));
    }
  }, [dispatch, userId, initial]);

  useEffect(() => {
    dispatch(setCustomerDialog(false));
    dispatch(setContactDialog(false));
  }, [dispatch]);

  const handleCustomerDialog = (event) =>{
    event.preventDefault();
    dispatch(setCustomerDialog(true))
    if ( securityUser?.customer?._id) {
      dispatch(getCustomer(securityUser?.customer?._id));
    }
  }

  const handleContactDialog = (event) =>{
    event.preventDefault();
    dispatch(setContactDialog(true))
    if ( securityUser?.contact?._id) {
      dispatch(getContact(securityUser?.customer?._id, securityUser?.contact?._id));
    }
  }

  const handleEdit = () => {
    // dispatch(setSecurityUserEditFormVisibility(true));
    navigate(PATH_SETTING.security.users.editProfile);
  };

  const defaultValues = useMemo(
    () => ({
      customer: securityUser?.customer?.name || '',
      contact: `${securityUser?.contact?.firstName || '' } ${securityUser?.contact?.lastName || '' }` || '',
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
      currentEmployee: securityUser?.currentEmployee || false,
      multiFactorAuthentication: securityUser?.multiFactorAuthentication,
      createdByFullName: securityUser?.createdBy?.name || '',
      createdAt: securityUser?.createdAt || '',
      createdIP: securityUser?.createdIP || '',
      updatedByFullName: securityUser?.updatedBy?.name || '',
      updatedAt: securityUser?.updatedAt || '',
      updatedIP: securityUser?.updatedIP || '',
      dataAccessibilityLevel: securityUser?.dataAccessibilityLevel || 'RESTRICTED',

    }),
    [securityUser]
  );

  const userRoleChips = defaultValues?.roles.map((role,index) => <Chip key={index} title={role.name} label={role.name} color={role.name === 'SuperAdmin' ? 'secondary' : 'default'} sx={{m:0.2}}/>);
  
  return (
      <Container maxWidth={false}>
        <Card
          sx={{
            mb: 3, height: 160,
            position: 'relative',
          }}
        >
          <Cover
            name={defaultValues?.name}
            photoURL={user.name === 'HOWICK LTD.' ? <LogoAvatar /> : <CustomAvatar />}
            icon="ph:users-light"
          />
        </Card>
        <Card sx={{ p: 3 }}>
          <ViewFormEditDeleteButtons 
              isActive={defaultValues.isActive}
              multiAuth={defaultValues?.multiFactorAuthentication} 
              currentEmp={defaultValues?.currentEmployee}
              handleEdit={handleEdit} 
            />
          <Grid container>
            <ViewFormField
              sm={6}
              heading="Customer"
              node={
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
              node={
                defaultValues?.contact && (
                  <Link onClick={ handleContactDialog } href="#" underline="none">
                    {defaultValues?.contact}
                  </Link>
                )
              }
            />
            <ViewFormField sm={6} heading="Full Name" param={defaultValues?.name} />
            <ViewFormField sm={6} heading="Phone" param={defaultValues?.phone} />
            <ViewFormField sm={6} heading="email" param={defaultValues?.email} />
            <ViewFormField sm={6} heading="Data Accessibility" param={defaultValues?.dataAccessibilityLevel || ''}/>
            <ViewFormField sm={6} heading="Login" param={defaultValues?.login} />
            <ViewFormField
              sm={6}
              heading="Roles"
              node={<Grid container>{userRoleChips}</Grid>}
            />
            <ViewFormField
              sm={12}
              heading="Regions"
              chips={defaultValues?.regions.map(region => region.name)}
            />
            <ViewFormField
              sm={12}
              heading="Countries"
              chips={defaultValues?.countries.map(country => country.name)}
            />
            <ViewFormField
              sm={12}
              heading="Customers"
              chips={defaultValues?.customers.map(customer => customer.name)}
            />
            <ViewFormField
              sm={12}
              heading="Machines"
              chips={defaultValues?.machines.map(machine => machine.name)}
            />
          </Grid>
          <ViewFormField />
          <Grid container>
            <ViewFormAudit defaultValues={defaultValues} />
          </Grid>
        </Card>
      </Container>
  );
}
