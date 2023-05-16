import { blue } from '@mui/material/colors';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// @mui
import { LoadingButton } from '@mui/lab';
import {
  Switch,
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  Container,
  DialogTitle,
  Dialog,
  InputAdornment,
  Link,
  Divider,
} from '@mui/material';
// global
import { CONFIG } from '../../config-global';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';

// slices
import { getCustomers, getCustomer, setCustomerEditFormVisibility, deleteCustomer } from '../../redux/slices/customer/customer';
import FormProvider, { RHFSwitch } from '../../components/hook-form';
import { fDateTime } from '../../utils/formatTime';
import ViewFormAudit from '../components/ViewFormAudit';
import ViewFormField from '../components/ViewFormField';
import ViewFormSwitch from '../components/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../components/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function CustomerViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customer } = useSelector((state) => state.customer);
  // console.log("customer : ",customer)
  const toggleEdit = () => {
    dispatch(setCustomerEditFormVisibility(true));
  };
const onDelete = async () => {
  await dispatch(deleteCustomer(customer._id));
  navigate(PATH_DASHBOARD.customer.list)
}


  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      id: customer?._id || '',
      name: customer?.name || '',
      tradingName: customer?.tradingName || '',
      accountManager: customer?.accountManager || '',
      projectManager: customer?.projectManager || '',
      supportManager: customer?.supportManager || '',
      mainSite: customer?.mainSite || null,
      primaryBillingContact: customer?.primaryBillingContact || null,
      primaryTechnicalContact: customer?.primaryTechnicalContact || null,
      isActive: customer?.isActive,
      createdAt: customer?.createdAt || '',
      createdByFullName: customer?.createdBy?.name || '',
      createdIP: customer?.createdIP || '',
      updatedAt: customer?.updatedAt || '',
      updatedByFullName: customer?.updatedBy?.name || '',
      updatedIP: customer?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customer]
  );
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons handleEdit={toggleEdit} onDelete={onDelete} />
      {/* <Grid item xs={12} sm={12} > */}
      {/* <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mb: -4 }}>
        <Button
          onClick={() => {
            toggleEdit();
          }}
          variant="contained"
          size="medium"
          startIcon={<Iconify icon="eva:edit-fill" />}
        >
          Edit Customer
        </Button>
      </Stack> */}
      {/* </Grid> */}

      <Grid container>
        <ViewFormField sm={6} heading="Name" param={defaultValues.name ? defaultValues.name : ''} />
        <ViewFormField
          sm={6}
          heading="Trading Name"
          param={defaultValues.tradingName ? defaultValues.tradingName : ''}
        />
        <ViewFormField
          sm={6}
          heading="Phone"
          param={defaultValues.mainSite?.phone ? defaultValues.mainSite.phone : ''}
        />
        <ViewFormField
          sm={6}
          heading="Fax"
          param={defaultValues.mainSite?.fax ? defaultValues.mainSite.fax : ''}
        />
        <ViewFormField
          sm={6}
          heading="Email"
          param={defaultValues.mainSite?.email ? defaultValues.mainSite.email : ''}
        />
      </Grid>
      <Grid container>
        <ViewFormField
          sm={6}
          heading="Primary Billing Contact"
          param={
            defaultValues.primaryBillingContact?.firstName
              ? defaultValues.primaryBillingContact.firstName
              : ''
          }
          secondParam={
            defaultValues.primaryBillingContact?.lastName
              ? defaultValues.primaryBillingContact.lastName
              : ''
          }
        />
        <ViewFormField
          sm={6}
          heading="Primary Technical Contact"
          param={
            defaultValues.primaryTechnicalContact?.firstName
              ? defaultValues.primaryTechnicalContact.firstName
              : ''
          }
          secondParam={
            defaultValues.primaryTechnicalContact?.lastName
              ? defaultValues.primaryTechnicalContact.lastName
              : ''
          }
        />
      </Grid>

      {defaultValues.mainSite && (
        <>
          <Grid sx={{ py: '2rem' }}>
            <Grid
              sx={{
                backgroundImage: (theme) =>
                  `linear-gradient(to right, ${theme.palette.primary.lighter} ,  white)`,
              }}
            >
              <Typography variant="h6" sx={{ px: 2, color: 'primary.contrastText' }}>
                Address Details
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <ViewFormField
              sm={6}
              heading="Site Name"
              param={defaultValues.mainSite.name ? defaultValues.mainSite.name : ''}
            />
            <ViewFormField
              sm={6}
              heading="Street"
              param={
                defaultValues.mainSite.address?.street ? defaultValues.mainSite.address.street : ''
              }
            />
            <ViewFormField
              sm={6}
              heading="Suburb"
              param={
                defaultValues.mainSite.address?.suburb ? defaultValues.mainSite.address.suburb : ''
              }
            />
            <ViewFormField
              sm={6}
              heading="City"
              param={
                defaultValues.mainSite.address?.city ? defaultValues.mainSite.address.city : ''
              }
            />
            <ViewFormField
              sm={6}
              heading="Post Code"
              param={
                defaultValues.mainSite.address?.postcode
                  ? defaultValues.mainSite.address.postcode
                  : ''
              }
            />
            <ViewFormField
              sm={6}
              heading="Region"
              param={
                defaultValues.mainSite.address?.region ? defaultValues.mainSite.address.region : ''
              }
            />
            <ViewFormField
              sm={6}
              heading="Country"
              param={
                defaultValues.mainSite.address?.country
                  ? defaultValues.mainSite.address.country
                  : ''
              }
            />
          </Grid>
        </>
      )}
      <Grid sx={{ py: '2rem' }}>
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
      <Grid container>
        <ViewFormField
          sm={6}
          heading="Account Manager"
          param={
            defaultValues.accountManager.firstName ? defaultValues.accountManager.firstName : ''
          }
          secondParam={
            defaultValues.accountManager.lastName ? defaultValues.accountManager.lastName : ''
          }
        />
        <ViewFormField
          sm={6}
          heading="Project Manager"
          param={
            defaultValues.projectManager.firstName ? defaultValues.projectManager.firstName : ''
          }
          secondParam={
            defaultValues.projectManager.lastName ? defaultValues.projectManager.lastName : ''
          }
        />
        <ViewFormField
          sm={6}
          heading="Suppport Manager"
          param={
            defaultValues.supportManager.firstName ? defaultValues.supportManager.firstName : ''
          }
          secondParam={
            defaultValues.supportManager.lastName ? defaultValues.supportManager.lastName : ''
          }
        />

        {/* <Grid item xs={12} sm={12} sx={{pt: 3,display:'flex', flexDirection:'column' }}>
         <Typography variant="overline" sx={{ px:2, color: 'text.disabled' }}>
              Active
            </Typography>
          <Switch sx={{ mb: 1 }} checked={defaultValues.isActive} disabled />
        </Grid> */}
        <Grid item xs={12} sm={12} sx={{ pt: 3, display: 'flex' }}>
          <Typography
            variant="overline"
            sx={{ pl: 2, pb: 1, color: 'text.disabled', display: 'flex', alignItems: 'center' }}
          >
            Active
          </Typography>
          <Switch sx={{ mb: 1 }} checked={defaultValues.isActive} disabled />
        </Grid>
      </Grid>
      <Grid container>
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}
