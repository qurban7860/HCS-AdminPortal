import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector, batch } from 'react-redux';
// @mui
import {
  Switch,
  Card,
  Grid,
  Container,
  Typography,
  Link,
  Dialog,
  Stack,
  Button,
  Tabs,
} from '@mui/material';
// routes
import { PATH_SETTING } from '../../../../routes/paths';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// _mock_
import { _userAbout } from '../../../../_mock/arrays';
import Iconify from '../../../../components/iconify';
// Redux Slice
import {
  getSecurityUser,
  setSecurityUserEditFormVisibility,
} from '../../../../redux/slices/securityUser/securityUser';
// components
// import { ProfileCover} from '../../sections/@dashboard/user/profile';
import { useSnackbar } from '../../../../components/snackbar';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import ViewFormAudit from '../../../../components/ViewForms/ViewFormAudit';
import { getCustomer } from '../../../../redux/slices/customer/customer';
import { getContact } from '../../../../redux/slices/customer/contact';
import { Cover } from '../../../../components/Defaults/Cover';
import DialogLabel from '../../../../components/Dialog/DialogLabel';
import DialogLink from '../../../../components/Dialog/DialogLink';
import FormLabel from '../../../../components/DocumentForms/FormLabel';
import LogoAvatar from '../../../../components/logo-avatar/LogoAvatar';
import CustomAvatar from '../../../../components/custom-avatar/CustomAvatar';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';
// ----------------------------------------------------------------------

export default function SecurityUserProfile() {
  const { customer } = useSelector((state) => state.customer);
  const { contact } = useSelector((state) => state.contact);
  const { securityUser, initial, isLoading} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const userId = localStorage.getItem('userId');
  const [currentTab, setCurrentTab] = useState('profile');
  const [openCustomer, setOpenCustomer] = useState(false);
  const handleOpenCustomer = () => setOpenCustomer(true);
  const handleCloseCustomer = () => setOpenCustomer(false);
  const [openContact, setOpenContact] = useState(false);
  const handleOpenContact = () => setOpenContact(true);
  const handleCloseContact = () => setOpenContact(false);

  useEffect(() => {
    if (userId) {
      dispatch(getSecurityUser(userId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userId, initial]);

  useEffect(() => {
    batch(() => {
      if (userId && securityUser?.customer?._id) {
        dispatch(getCustomer(securityUser?.customer?._id));
      }
      if (userId && securityUser?.contact?._id) {
        dispatch(getContact(securityUser?.customer?._id, securityUser?.contact?._id));
      }
    });
  }, [dispatch, userId, securityUser]);

  const handleViewCustomer = (id) => {
    navigate(PATH_SETTING.security.users.view(id));
  };

  const handleEdit = () => {
    dispatch(setSecurityUserEditFormVisibility(true));
    navigate(PATH_SETTING.security.users.edit(securityUser?._id));
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
           />
        </Card>
        <Card sx={{ p: 3 }}>
          <ViewFormEditDeleteButtons handleEdit={handleEdit} />
          <Grid container>
            <ViewFormField
              sm={6}
              heading="Customer"
              node={
                defaultValues?.customer && (
                  <Link onClick={handleOpenCustomer} href="#" underline="none">
                    {defaultValues?.customer}
                  </Link>
                )
              }
            />
            <ViewFormField isLoading={isLoading}
              sm={6}
              heading="Contact"
              node={
                defaultValues?.contact && (
                  <Link onClick={handleOpenContact} href="#" underline="none">
                    {defaultValues?.contact}
                  </Link>
                )
              }
            />
            <ViewFormField isLoading={isLoading} sm={6} heading="Full Name" param={defaultValues?.name} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Phone" param={defaultValues?.phone} />
            <ViewFormField isLoading={isLoading} sm={12} heading="email" param={defaultValues?.email} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Login" param={defaultValues?.login} />
            <ViewFormField isLoading={isLoading}
              sm={6}
              heading="Roles"
              chips={defaultValues?.roles}
              userRolesChips={defaultValues?.roles}
            />
          </Grid>
          <ViewFormField isLoading={isLoading} />
          <Grid container>
            <ViewFormAudit defaultValues={defaultValues} />
          </Grid>
        </Card>
      </Container>
      <Dialog
        open={openCustomer}
        onClose={handleCloseCustomer}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogLabel content="Customer" onClick={() => handleCloseCustomer()} />
        <Grid container sx={{ p: 2 }}>
          <ViewFormField isLoading={isLoading} sm={12} heading="Name" param={customer?.name} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Trading Name" param={customer?.tradingName} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Phone" param={customer?.mainSite?.phone} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Fax" param={customer?.mainSite?.fax} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Email" param={customer?.mainSite?.email} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Site Name" param={customer?.mainSite?.name} />
          <FormLabel content="Address Information" />
          <ViewFormField isLoading={isLoading} sm={6} heading="Street" param={customer?.mainSite?.address?.street} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Suburb" param={customer?.mainSite?.address?.suburb} />
          <ViewFormField isLoading={isLoading} sm={6} heading="City" param={customer?.mainSite?.address?.city} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Region" param={customer?.mainSite?.address?.region} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Post Code" param={customer?.mainSite?.address?.postcode} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Country" param={customer?.mainSite?.address?.country} />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Primary Biling Contact"
            param={
              customer?.primaryBillingContact &&
              `${customer?.primaryBillingContact?.firstName} ${customer?.primaryBillingContact?.lastName}`
            }
          />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Primary Technical Contact"
            param={
              customer?.primaryTechnicalContact &&
              `${customer?.primaryTechnicalContact?.firstName} ${customer?.primaryTechnicalContact?.lastName}`
            }
          />
        </Grid>
        <Grid container sx={{ px: 2, pb: 3 }}>
          <FormLabel content="Howick Resources" />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Account Manager"
            param={`${customer?.accountManager?.firstName} ${customer?.accountManager?.lastName}`}
          />  
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Project Manager"
            param={`${customer?.projectManager?.firstName} ${customer?.projectManager?.lastName}`}
          />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Suppport Manager"
            param={`${customer?.supportManager?.firstName} ${customer?.supportManager?.lastName}`}
          />
        </Grid>
        <DialogLink content="Go to customer" onClick={() => handleViewCustomer(customer._id)} />
      </Dialog>
      <Dialog
        open={openContact}
        onClose={handleCloseContact}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogLabel content="Contact" onClick={() => handleCloseContact()} />
        <Grid container sx={{ px: 2, py: 2 }}>
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="First Name"
            param={contact?.firstName && contact?.firstName}
          />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Last Name"
            param={contact?.lastName && contact?.lastName}
          />
          <ViewFormField isLoading={isLoading} sm={6} heading="Title" param={contact?.title && contact?.title} />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Contact Types"
            param={contact?.contactTypes && contact?.contactTypes.toString()}
          />
          <ViewFormField isLoading={isLoading} sm={6} heading="Phone" param={contact?.phone && contact?.phone} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Email" param={contact?.email && contact?.email} />
          <FormLabel content="Address Information" />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Street"
            param={contact?.address?.street && contact?.address?.street}
          />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Suburb"
            param={contact?.address?.suburb && contact?.address?.suburb}
          />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="City"
            param={contact?.address?.city && contact?.address?.city}
          />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Region"
            param={contact?.address?.region && contact?.address?.region}
          />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Post Code"
            param={contact?.address?.postcode && contact?.address?.postcode}
          />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Country"
            param={contact?.address?.country && contact?.address?.country}
          />
          <ViewFormField isLoading={isLoading} />
        </Grid>
      </Dialog>
    </>
  );
}
