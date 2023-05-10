import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { useDispatch, useSelector,batch } from 'react-redux';

// @mui
import {Switch, Card, Grid, Container, Typography, Modal , Fade, Box , Link ,Dialog,  DialogTitle, Stack,Button, Divider} from '@mui/material';
import ConfirmDialog from '../../components/confirm-dialog';
// routes
import { PATH_MACHINE , PATH_DASHBOARD } from '../../routes/paths';
// slices
import { getSecurityUser,getSecurityUsers, deleteSecurityUser, setSecurityUserEditFormVisibility } from '../../redux/slices/securityUser/securityUser';
import { getCustomer } from '../../redux/slices/customer/customer';
import { getContact } from '../../redux/slices/customer/contact';
import Iconify from '../../components/iconify';
import ViewFormSubtitle from '../components/ViewFormSubtitle';
import ViewFormField from '../components/ViewFormField';
import ViewFormAudit from '../components/ViewFormAudit';
import ViewFormEditDeleteButtons from '../components/ViewFormEditDeleteButtons';
import {Cover} from '../components/Cover';
import { useAuthContext } from '../../auth/useAuthContext';
import FormProvider, { RHFSwitch, RHFTextField, RHFMultiSelect, } from '../../components/hook-form';
import { useSnackbar } from '../../components/snackbar';
import { dispatchReq, dispatchReqAddAndView, dispatchReqNavToList, dispatchReqNoMsg } from '../asset/dispatchRequests';
import palette from '../../theme';

// ----------------------------------------------------------------------


export default function SecurityUserViewForm() {
  const regEx = /^[^2]*/
  const { securityUser , initial } = useSelector((state) => state.user);
  const { customer } = useSelector((state) => state.customer);
  const { contact } = useSelector((state) => state.contact);
  const [openContact, setOpenContact] = useState(false);
  const handleOpenContact = () => setOpenContact(true);
  const handleCloseContact = () => setOpenContact(false);

  const [openCustomer, setOpenCustomer] = useState(false);
  const handleOpenCustomer = () => setOpenCustomer(true);
  const handleCloseCustomer = () => setOpenCustomer(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const { user } = useAuthContext();
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(()=> {
    if(id){
      dispatchReqNoMsg(dispatch,getSecurityUser(id),enqueueSnackbar)
  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id,dispatch])

    useEffect(()=>{
      batch(() => {
        if(securityUser && securityUser?.customer && securityUser?.customer?._id){
          dispatch(getCustomer(securityUser?.customer?._id))
        }
        if(securityUser && securityUser?.contact && securityUser?.contact?._id){
          dispatch(getContact(securityUser?.customer?._id,securityUser?.contact?._id))
        }})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dispatch,securityUser])


  const handleEdit = () => {
    dispatch(setSecurityUserEditFormVisibility(true));
    navigate(PATH_DASHBOARD.user.edit(securityUser._id));
  }

  const onDelete = async () => {
    await dispatch(deleteSecurityUser(id));
    dispatch(getSecurityUsers());
    navigate(PATH_DASHBOARD.user.list)
  }

  const handleViewCustomer = (Id) => {
    navigate(PATH_DASHBOARD.customer.view(Id));
  };

  const defaultValues = useMemo(
    () => ({
      customer:                 securityUser?.customer?.name || "",
      contact:                  securityUser?.contact?.firstName || "",
      name:                     securityUser?.name || "",
      phone:                    securityUser?.phone || "",
      email:                    securityUser?.email || "",
      login:                    securityUser?.login || "",
      roles:                    securityUser?.roles ,
      isActive:                 securityUser?.isActive,
      createdByFullName:        securityUser?.createdBy?.name ,
      createdAt:                securityUser?.createdAt ,
      createdIP:                securityUser?.createdIP ,
      updatedByFullName:        securityUser?.updatedBy?.name ,
      updatedAt:                securityUser?.updatedAt ,
      updatedIP:                securityUser?.updatedIP ,
    }
    ),
    [securityUser] );

  return (
    <Grid sx={{ p: 3, mt: -3 }}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
        <Cover name={defaultValues.name} icon="ph:users-light" />
      </Card>
      <Card sx={{ p: 3 }}>
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mb: -4, mt: -1, mr: 2 }}>
          <Button
            onClick={() => handleEdit()}
            variant="outlined"
            startIcon={<Iconify icon="eva:edit-fill" />}
          >
            Edit
          </Button>
          {user?.email !== securityUser?.login ? (
            <Button
              onClick={() => {
                handleOpenConfirm();
              }}
              variant="outlined"
              color="error"
              startIcon={<Iconify icon="eva:trash-2-fill" />}
            >
              Delete
            </Button>
          ) : (
            ''
          )}
        </Stack>
        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Delete"
          content="Are you sure want to delete?"
          action={
            <Button variant="contained" color="error" onClick={onDelete}>
              Delete
            </Button>
          }
        />

        <Grid container>
          <ViewFormField
            sm={6}
            heading="Customer"
            objectParam={
              defaultValues?.customer ? (
                <Link onClick={handleOpenCustomer} href="#" underline="none">
                  {defaultValues?.customer}
                </Link>
              ) : (
                ''
              )
            }
          />
          {/* <ViewFormField sm={6} heading="Customer" param={defaultValues.customer} /> */}
          <ViewFormField
            sm={6}
            heading="Contact"
            objectParam={
              defaultValues?.contact ? (
                <Link onClick={handleOpenContact} href="#" underline="none">
                  {defaultValues?.contact}
                </Link>
              ) : (
                ''
              )
            }
          />
          {/* <ViewFormField sm={6} heading="Contact" param={defaultValues.contact} /> */}
          <ViewFormField sm={6} heading="Full Name" param={defaultValues.name} />
          <ViewFormField sm={6} heading="Phone" param={defaultValues.phone} />
          <ViewFormField sm={12} heading="email" param={defaultValues.email} />
          <ViewFormField sm={6} heading="Login" param={defaultValues.login} />
          <ViewFormField
            sm={6}
            heading="Roles"
            param={defaultValues.roles?.map((obj) => obj.name).join(', ')}
          />
        </Grid>

        <Switch sx={{ mt: 1 }} checked={defaultValues.isActive} disabled />
        <Grid container>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Card>
      <Dialog
        open={openCustomer}
        onClose={handleCloseCustomer}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Grid
          container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            padding: '10px',
          }}
        >
          <Typography variant="h4" sx={{ px: 2 }}>
            Customer{' '}
          </Typography>{' '}
          <Link onClick={() => handleCloseCustomer()} href="#" underline="none" sx={{ ml: 'auto' }}>
            {' '}
            <Iconify icon="mdi:close-box-outline" />
          </Link>
        </Grid>
        <Grid container sx={{ px: 2, pt: 2 }}>
          <ViewFormField sm={12} heading="Name" param={customer?.name ? customer?.name : ''} />
          <ViewFormField
            sm={6}
            heading="Trading Name"
            param={customer?.tradingName ? customer?.tradingName : ''}
          />
          <ViewFormField
            sm={6}
            heading="Phone"
            param={customer?.mainSite?.phone ? customer?.mainSite.phone : ''}
          />
          <ViewFormField
            sm={6}
            heading="Fax"
            param={customer?.mainSite?.fax ? customer?.mainSite.fax : ''}
          />
          <ViewFormField
            sm={6}
            heading="Email"
            param={customer?.mainSite?.email ? customer?.mainSite.email : ''}
          />
          <ViewFormField
            sm={6}
            heading="Site Name"
            param={customer?.mainSite?.address ? customer?.mainSite?.address?.street : ''}
          />
          <ViewFormField
            sm={6}
            heading="Street"
            param={customer?.mainSite?.address ? customer?.mainSite?.address?.street : ''}
          />
          <ViewFormField
            sm={6}
            heading="Suburb"
            param={customer?.mainSite?.address ? customer?.mainSite?.address?.suburb : ''}
          />
          <ViewFormField
            sm={6}
            heading="City"
            param={customer?.mainSite?.address ? customer?.mainSite?.address?.city : ''}
          />
          <ViewFormField
            sm={6}
            heading="Region"
            param={customer?.mainSite?.address ? customer?.mainSite?.address?.region : ''}
          />
          <ViewFormField
            sm={6}
            heading="Post Code"
            param={customer?.mainSite?.address ? customer?.mainSite?.address?.postcode : ''}
          />
          <ViewFormField
            sm={12}
            heading="Country"
            param={customer?.mainSite?.address ? customer?.mainSite?.address?.country : ''}
          />
          <ViewFormField
            sm={6}
            heading="Primary Biling Contact"
            param={
              customer?.primaryBillingContact
                ? `${customer?.primaryBillingContact?.firstName} ${customer?.primaryBillingContact?.lastName}`
                : ''
            }
          />
          <ViewFormField
            sm={6}
            heading="Primary Technical Contact"
            param={
              customer?.primaryTechnicalContact
                ? `${customer?.primaryTechnicalContact?.firstName} ${customer?.primaryTechnicalContact?.lastName}`
                : ''
            }
          />
        </Grid>
        <Grid sx={{ p: '2rem' }}>
          <Grid
            sx={{
              backgroundImage: (theme) =>
                `linear-gradient(to right, ${theme.palette.primary.lighter} ,  white)`,
            }}
          >
            <Typography variant="h6" sx={{ px: 2, color: 'primary.contrastText' }}>
              Howick Resources{' '}
            </Typography>
          </Grid>
        </Grid>
        <Grid container sx={{ px: 2, pb: 3 }}>
          <ViewFormField
            sm={6}
            heading="Account Manager"
            param={customer?.accountManager?.firstName}
            secondParam={customer?.accountManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Project Manager"
            param={customer?.projectManager?.firstName}
            secondParam={customer?.projectManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Suppport Manager"
            param={customer?.supportManager?.firstName}
            secondParam={customer?.supportManager?.lastName}
          />
        </Grid>
        <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} sm={12}>
          <Link
            onClick={() => handleViewCustomer(customer._id)}
            href="#"
            underline="none"
            sx={{
              ml: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              px: 3,
              pb: 3,
            }}
          >
            {' '}
            <Typography variant="body" sx={{ px: 2 }}>
              Go to customer
            </Typography>
            <Iconify icon="mdi:share" />
          </Link>
        </Grid>
      </Dialog>

      <Dialog
        open={openContact}
        onClose={handleCloseContact}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Grid
          container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            padding: '10px',
          }}
        >
          <Typography variant="h4" sx={{ px: 2 }}>
            Contact{' '}
          </Typography>{' '}
          <Link onClick={() => handleCloseCustomer()} href="#" underline="none" sx={{ ml: 'auto' }}>
            {' '}
            <Iconify icon="mdi:close-box-outline" />
          </Link>
        </Grid>
        <Grid container sx={{ px: 2, py: 2 }}>
          {/* <Grid
            item
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            sm={12}
          >
            <Typography variant="h4" sx={{ px: 2 }}>
              Contact{' '}
            </Typography>{' '}
            <Link
              onClick={() => handleCloseContact()}
              href="#"
              underline="none"
              sx={{ ml: 'auto' }}
            >
              {' '}
              <Iconify icon="mdi:close-box-outline" />
            </Link>
          </Grid> */}
          <ViewFormField
            sm={6}
            heading="First Name"
            param={contact?.firstName ? contact?.firstName : ''}
          />
          <ViewFormField
            sm={6}
            heading="Last Name"
            param={contact?.lastName ? contact?.lastName : ''}
          />
          <ViewFormField sm={6} heading="Title" param={contact?.title ? contact?.title : ''} />
          <ViewFormField
            sm={6}
            heading="Contact Types"
            param={contact?.contactTypes ? contact?.contactTypes.toString() : ''}
          />
          <ViewFormField sm={6} heading="Phone" param={contact?.phone ? contact?.phone : ''} />
          <ViewFormField sm={6} heading="Email" param={contact?.email ? contact?.email : ''} />
          <ViewFormField
            sm={6}
            heading="Street"
            param={contact?.address?.street ? contact?.address?.street : ''}
          />
          <ViewFormField
            sm={6}
            heading="Suburb"
            param={contact?.address?.suburb ? contact?.address?.suburb : ''}
          />
          <ViewFormField
            sm={6}
            heading="City"
            param={contact?.address?.city ? contact?.address?.city : ''}
          />
          <ViewFormField
            sm={6}
            heading="Region"
            param={contact?.address?.region ? contact?.address?.region : ''}
          />
          <ViewFormField
            sm={6}
            heading="Post Code"
            param={contact?.address?.postcode ? contact?.address?.postcode : ''}
          />
          <ViewFormField
            sm={6}
            heading="Country"
            param={contact?.address?.country ? contact?.address?.country : ''}
          />
        </Grid>
        {/* <Grid item sx={{display: "flex", justifyContent:"center", alignItems:"center" }} sm={12}>
          <Link onClick={() => handleViewContact(contact?._id)} href="#" underline="none" sx={{ml: "auto",display: "flex", justifyContent:"center", alignItems:"center", px:3, pb:3}}> <Typography variant="body" sx={{px:2}}>Go to contact</Typography><Iconify icon="mdi:link-box-variant-outline" /></Link>
        </Grid> */}
      </Dialog>
    </Grid>
  );
};
