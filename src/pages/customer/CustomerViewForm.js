import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link as RouterLink, useNavigate } from 'react-router-dom';

// @mui
import { LoadingButton } from '@mui/lab';
import {Switch, Box, Card, Grid, Stack, Typography, Button, Container, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
// global
import { CONFIG } from '../../config-global';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';

// slices
import { getCustomers, getCustomer, setCustomerEditFormVisibility } from '../../redux/slices/customer/customer';

import { fDateTime } from '../../utils/formatTime';
import ViewFormAudit from '../components/ViewFormAudit';


// ----------------------------------------------------------------------

export default function CustomerViewForm() {

  const dispatch = useDispatch();

  const { customer } = useSelector((state) => state.customer);
console.log("customer : " , customer)
  const toggleEdit = () => {
    dispatch(setCustomerEditFormVisibility(true));
  }
  
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      id: customer?._id || "",
      name: customer?.name || "",
      tradingName: customer?.tradingName || "",
      accountManager: customer?.accountManager || "",
      projectManager: customer?.projectManager || "",
      supportManager: customer?.supportManager || "",
      mainSite: customer?.mainSite || null,
      primaryBillingContact: customer?.primaryBillingContact || null,
      primaryTechnicalContact: customer?.primaryTechnicalContact || null,
      isActive: customer?.isActive,
      createdAt:                customer?.createdAt || "",
      createdByFullname:           customer?.createdBy?.name || "",
      createdIP:                customer?.createdIP || "",
      updatedAt:                customer?.updatedAt || "",
      updatedByFullname:           customer?.updatedBy?.name || "",
      updatedIP:                customer?.updatedIP || "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customer]
  );


  return (

      <Card sx={{ p: 4 }}>
    
      {/* <Grid item xs={12} sm={12} > */}
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mb: -4}}>
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
        </Stack>
      {/* </Grid> */}

        <Grid container>

          <Grid item xs={12} sm={6} sx={{ pt:2 }}>
            <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
              Name
            </Typography>

            <Typography variant="body2">{defaultValues.name}</Typography>

          </Grid>


          <Grid item xs={12} sm={6} sx={{ pt:2 }}>
            <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
              Trading Name
            </Typography>

            <Typography variant="body2">{defaultValues.tradingName ? defaultValues.tradingName : ''}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ pt:2 }}>
          <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
            Phone
          </Typography>

          <Typography variant="body2">{defaultValues.mainSite?.phone ? defaultValues.mainSite.phone : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ pt:2 }}>
          <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
            Fax
          </Typography>

          <Typography variant="body2">{defaultValues.mainSite?.fax? defaultValues.mainSite.fax : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ pt:2 }}>
          <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
            Email
          </Typography>

          <Typography variant="body2">{defaultValues.mainSite?.email? defaultValues.mainSite.email : ''}</Typography>

        </Grid>

          
          </Grid>
          
          {/* {fDate(createdAt)} */}

          {defaultValues.mainSite && <Grid container>


          <Grid item xs={12} sm={12} sx={{ pt:2 }}>
            <Typography variant="subtitle2" sx={{ color: '#131414' }}>
              Address Details
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ pt:2 }}>
          <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
            Site Name
          </Typography>

          <Typography variant="body2">{defaultValues.mainSite.name ? defaultValues.mainSite.name : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ pt:2 }}>
          <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
            Street
          </Typography>

          <Typography variant="body2">{defaultValues.mainSite.address?.street ? defaultValues.mainSite.address.street : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ pt:2 }}>
          <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
            Suburb
          </Typography>

          <Typography variant="body2">{defaultValues.mainSite.address?.suburb ? defaultValues.mainSite.address.suburb : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ pt:2 }}>
          <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
            City
          </Typography>

          <Typography variant="body2">{defaultValues.mainSite.address?.city ? defaultValues.mainSite.address.city : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ pt:2 }}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            Post Code
          </Typography>

          <Typography variant="body2">{defaultValues.mainSite.address?.postcode  ? defaultValues.mainSite.address.postcode : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ pt:2 }}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            Region
          </Typography>

          <Typography variant="body2">{defaultValues.mainSite.address?.region  ? defaultValues.mainSite.address.region : ''}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ pt:2 }}>
          <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
            Country
          </Typography>

          <Typography variant="body2">{defaultValues.mainSite.address?.country  ? defaultValues.mainSite.address.country : ''}</Typography>

        </Grid>

        </Grid>
        }

        {(defaultValues.primaryBillingContact || defaultValues.primaryTechnicalContact)&& <Grid container>

          {defaultValues.primaryBillingContact && <Grid item xs={12} sm={6} sx={{ pt:2 }}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            Primary Billing Contact
          </Typography>

          <Typography variant="body2">
            {defaultValues.primaryBillingContact?.firstName ? defaultValues.primaryBillingContact.firstName : ''} {defaultValues.primaryBillingContact?.lastName ? defaultValues.primaryBillingContact.lastName : ''}
          </Typography>

        </Grid>}

        {defaultValues.primaryTechnicalContact && <Grid item xs={12} sm={6} sx={{ pt:2 }}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            Primary Technical Contact
          </Typography>

          <Typography variant="body2">
            {defaultValues.primaryTechnicalContact?.firstName ? defaultValues.primaryTechnicalContact.firstName : ''}  {defaultValues.primaryTechnicalContact?.lastName ? defaultValues.primaryTechnicalContact.lastName : ''}
          </Typography>

        </Grid>}


        </Grid>}

        <Grid container>


          <Grid item xs={12} sm={12} sx={{ pt:2 }}>
            <Typography variant="subtitle2" sx={{ color: '#131414' }}>
               Howick Resources
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ pt:2 }}>
            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Account Manager
            </Typography>

            <Typography variant="body2">{defaultValues.accountManager.firstName} {defaultValues.accountManager.lastName}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{pt:2 }}>
            <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
              Project Manager
            </Typography>

            <Typography variant="body2">{defaultValues.projectManager.firstName} {defaultValues.projectManager.lastName}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ pt:2 }}>
            <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
             Suppport Manager
            </Typography>

            <Typography variant="body2">{defaultValues.supportManager.firstName} {defaultValues.supportManager.lastName}</Typography>
            
          </Grid> 

          <Grid item xs={12} sm={12} >
            <Switch sx={{mb:1}} checked = { defaultValues.isActive } disabled  />
          </Grid>

          </Grid>


        <Grid container>
          <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>

      </Card>
  );
}
