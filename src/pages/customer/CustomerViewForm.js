import { blue } from '@mui/material/colors';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography, Button, Link, Breadcrumbs, Tooltip } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_CUSTOMER } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';
// slices
import {
  getCustomers,
  getCustomer,
  setCustomerEditFormVisibility,
  deleteCustomer,
} from '../../redux/slices/customer/customer';
import FormProvider, { RHFSwitch } from '../../components/hook-form';
import { fDateTime } from '../../utils/formatTime';
import ViewFormAudit from '../components/ViewFormAudit';
import ViewFormField from '../components/ViewFormField';
import ViewFormEditDeleteButtons from '../components/ViewFormEditDeleteButtons';
import BreadcrumbsProducer from '../components/BreadcrumbsProducer';

// ----------------------------------------------------------------------

export default function CustomerViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customer } = useSelector((state) => state.customer);
  // console.log("customer : ",customer)
  // const toggleEdit = () => {
  //   dispatch(setCustomerEditFormVisibility(true));
  // };

  const handleEdit = () => {
    dispatch(setCustomerEditFormVisibility(true));
  };
  const onDelete = async () => {
    await dispatch(deleteCustomer(customer._id));
    navigate(PATH_DASHBOARD.customer.list);
  };

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
    <>
      <Stack alignItems="flex-end" sx={{ mt: 5.5, padding: 2 }}>
        <Button />
        <Grid container>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              underline="none"
              variant="subtitle2"
              color="inherit"
              href={PATH_DASHBOARD.customer.list}
            >
              Customers
            </Link>
            <Link
              underline="none"
              variant="subtitle2"
              color="inherit"
              href={PATH_DASHBOARD.customer.root}
            >
              {customer.name}
            </Link>
          </Breadcrumbs>
        </Grid>
      </Stack>
      <Card sx={{ p: 3 }}>
        <ViewFormEditDeleteButtons handleEdit={handleEdit} onDelete={onDelete} />
        <Grid container>
          <Tooltip title="Active">
            <ViewFormField sm={12} isActive={defaultValues.isActive} />
          </Tooltip>
          <ViewFormField sm={6} heading="Name" param={defaultValues?.name} />
          <ViewFormField sm={6} heading="Trading Name" param={defaultValues?.tradingName} />
          <ViewFormField sm={6} heading="Phone" param={defaultValues?.mainSite?.phone} />
          <ViewFormField sm={6} heading="Fax" param={defaultValues?.mainSite?.fax} />
          <ViewFormField sm={6} heading="Email" param={defaultValues?.mainSite?.email} />
        </Grid>
        <Grid container>
          <ViewFormField
            sm={6}
            heading="Primary Billing Contact"
            param={defaultValues?.primaryBillingContact?.firstName}
            secondParam={defaultValues?.primaryBillingContact?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Primary Technical Contact"
            param={defaultValues?.primaryTechnicalContact?.firstName}
            secondParam={defaultValues?.primaryTechnicalContact?.lastName}
          />
        </Grid>

        {defaultValues.mainSite && (
          <Grid container>
            <Grid container sx={{ pt: '2rem' }}>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{
                  backgroundImage: (theme) =>
                    `linear-gradient(to right, ${theme.palette.primary.main} ,  white)`,
                }}
              >
                <Typography variant="h6" sm={12} sx={{ ml: '1rem', color: 'white' }}>
                  Address Information
                </Typography>
              </Grid>
            </Grid>
            <ViewFormField sm={6} heading="Site Name" param={defaultValues?.mainSite?.name} />
            <ViewFormField
              sm={6}
              heading="Street"
              param={defaultValues?.mainSite.address?.street}
            />
            <ViewFormField
              sm={6}
              heading="Suburb"
              param={defaultValues?.mainSite.address?.suburb}
            />
            <ViewFormField sm={6} heading="City" param={defaultValues?.mainSite.address?.city} />
            <ViewFormField
              sm={6}
              heading="Post Code"
              param={defaultValues?.mainSite.address?.postcode}
            />
            <ViewFormField
              sm={6}
              heading="Region"
              param={defaultValues?.mainSite.address?.region}
            />
            <ViewFormField
              sm={6}
              heading="Country"
              param={defaultValues?.mainSite.address?.country}
            />
          </Grid>
        )}
        <Grid container>
          <Grid container sx={{ pt: '2rem' }}>
            <Grid
              item
              xs={12}
              sm={12}
              sx={{
                backgroundImage: (theme) =>
                  `linear-gradient(to right, ${theme.palette.primary.main} ,  white)`,
              }}
            >
              <Typography variant="h6" sm={12} sx={{ ml: '1rem', color: 'white' }}>
                Howick Resources
              </Typography>
            </Grid>
          </Grid>
          <ViewFormField
            sm={6}
            heading="Account Manager"
            param={defaultValues?.accountManager?.firstName}
            secondParam={defaultValues?.accountManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Project Manager"
            param={defaultValues?.projectManager?.firstName}
            secondParam={defaultValues?.projectManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Suppport Manager"
            param={defaultValues?.supportManager?.firstName}
            secondParam={defaultValues?.supportManager?.lastName}
          />
          <ViewFormField />
          {/* <ViewFormSwitch isActive={defaultValues.isActive} /> */}
        </Grid>
        <Grid container sx={{ pb: '1rem' }}>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Card>
    </>
  );
}
