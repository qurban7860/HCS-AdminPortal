import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, Link, DialogActions, Button, Dialog } from '@mui/material';
import { setCustomerDialog } from '../../../redux/slices/customer/customer';
import Iconify from '../../../components/iconify';
import { PATH_CUSTOMER } from '../../../routes/paths';
import DialogLink from './DialogLink';
import DialogLabel from './DialogLabel';
import ViewFormField from '../ViewForms/ViewFormField';
import FormLabel from '../DocumentForms/FormLabel';

function CustomerDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customer, customerDialog } = useSelector((state) => state.customer);
  const handleCustomerDialog = () => { dispatch(setCustomerDialog(false))  }
  return (
    <Dialog
      disableEnforceFocus
      maxWidth="lg"
      open={customerDialog}
      onClose={handleCustomerDialog}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogLabel onClick={handleCustomerDialog} content="Customer" />
      <Grid item container sx={{ px: 2, pt: 2 }}>
        <ViewFormField sm={12} heading="Name" param={customer?.name} />
        <ViewFormField sm={12} heading="Trading Name" chips={customer?.tradingName} />
        <ViewFormField sm={6} heading="Phone" param={customer?.mainSite?.phone} />
        <ViewFormField sm={6} heading="Fax" param={customer?.mainSite?.fax} />
        <ViewFormField sm={6} heading="Email" param={customer?.mainSite?.email} />
        <ViewFormField sm={6} heading="Site Name" param={customer?.mainSite?.name} />
        <FormLabel content="Address Information" />
        <ViewFormField sm={6} heading="Street" param={customer?.mainSite?.address?.street} />
        <ViewFormField sm={6} heading="Suburb" param={customer?.mainSite?.address?.suburb} />
        <ViewFormField sm={6} heading="City" param={customer?.mainSite?.address?.city} />
        <ViewFormField sm={6} heading="Region" param={customer?.mainSite?.address?.region} />
        <ViewFormField sm={6} heading="Post Code" param={customer?.mainSite?.address?.postcode} />
        <ViewFormField sm={12} heading="Country" param={customer?.mainSite?.address?.country} />
        <ViewFormField
          sm={6}
          heading="Primary Biling Contact"
          param={
            customer?.primaryBillingContact &&
            `${customer?.primaryBillingContact?.firstName} ${customer?.primaryBillingContact?.lastName}`
          }
        />
        <ViewFormField
          sm={6}
          heading="Primary Technical Contact"
          param={
            customer?.primaryTechnicalContact &&
            `${customer?.primaryTechnicalContact?.firstName} ${customer?.primaryTechnicalContact?.lastName}`
          }
        />
      </Grid>
      <Grid item container sx={{ px: 2, pb: 3 }}>
        <FormLabel content="Howick Resources" />
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
      <DialogLink
        onClick={() => navigate(PATH_CUSTOMER.view(customer._id))}
        content="Go to customer"
      />
    </Dialog>
  );
}


export default CustomerDialog;
