import React, { useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Dialog, DialogContent } from '@mui/material';
import { setCustomerDialog } from '../../../redux/slices/customer/customer';
// import Iconify from '../../../components/iconify';
import { PATH_CUSTOMER } from '../../../routes/paths';
import DialogLink from './DialogLink';
import DialogLabel from './DialogLabel';
import FormLabel from '../DocumentForms/FormLabel';
import ViewFormFieldWithSkelton from '../ViewForms/ViewFormFieldWithSkelton';
import ViewFormField from '../ViewForms/ViewFormField';

function CustomerDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customer, customerDialog, isLoading } = useSelector((state) => state.customer);
  const handleCustomerDialog = () => { dispatch(setCustomerDialog(false))  }

  return (
    <Dialog
      disableEnforceFocus
      maxWidth="lg"
      open={customerDialog}
      onClose={handleCustomerDialog}
      aria-describedby="alert-dialog-slide-description"
      // keepMounted // for scroll lock
    >

     <DialogLabel onClick={ handleCustomerDialog } content="Customer" />
      <DialogContent dividers>
        <Grid item container>
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={12} heading="Name" param={customer?.name} />
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={12} heading="Trading Name" chips={customer?.tradingName} />
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={6} heading="Phone" param={customer?.mainSite?.phone} />
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={6} heading="Fax" param={customer?.mainSite?.fax} />
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={6} heading="Email" param={customer?.mainSite?.email} />
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={6} heading="Site Name" param={customer?.mainSite?.name} />
          <FormLabel content="Address Information" />
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={6} heading="Street" param={customer?.mainSite?.address?.street} />
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={6} heading="Suburb" param={customer?.mainSite?.address?.suburb} />
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={6} heading="City" param={customer?.mainSite?.address?.city} />
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={6} heading="Region" param={customer?.mainSite?.address?.region} />
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={6} heading="Post Code" param={customer?.mainSite?.address?.postcode} />
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={12} heading="Country" param={customer?.mainSite?.address?.country} />
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={6} heading="Primary Biling Contact"
            param={
              customer?.primaryBillingContact &&
              `${customer?.primaryBillingContact?.firstName} ${customer?.primaryBillingContact?.lastName}`
            }
          />
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={6} heading="Primary Technical Contact"
            param={
              customer?.primaryTechnicalContact &&
              `${customer?.primaryTechnicalContact?.firstName} ${customer?.primaryTechnicalContact?.lastName}`
            }
          />
        </Grid>
        <Grid item container sx={{ px: 2, pb: 3 }}>
          <FormLabel content="Howick Resources" />
          
          <ViewFormFieldWithSkelton isLoading={isLoading} sm={6} heading="Account Manager"
            param={
              customer?.accountManager &&
              `${customer?.accountManager?.firstName} ${customer?.accountManager?.lastName}`
            }
          />

          <ViewFormFieldWithSkelton isLoading={isLoading} sm={6} heading="Project Manager"
            param={
              customer?.projectManager &&
              `${customer?.projectManager?.firstName} ${customer?.projectManager?.lastName}`
            }
          />

          <ViewFormFieldWithSkelton isLoading={isLoading} sm={6} heading="Suppport Manager"
            param={
              customer?.supportManager &&
              `${customer?.supportManager?.firstName} ${customer?.supportManager?.lastName}`
            }
          />

        </Grid>
      </DialogContent>
      <DialogLink
        onClose={handleCustomerDialog}
        onClick={() => navigate(PATH_CUSTOMER.view(customer._id))}
        content="Go to Customer"
      />
    </Dialog>
  );
}


export default CustomerDialog;
