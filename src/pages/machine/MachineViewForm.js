import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link as RouterLink, useNavigate } from 'react-router-dom';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button, Container, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
// global
import { CONFIG } from '../../config-global';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';

// slices
import { getMachines, getMachine, setMachineEditFormVisibility } from '../../redux/slices/products/machine';


import { fDateTime , fDate } from '../../utils/formatTime';


// ----------------------------------------------------------------------

export default function CustomerViewForm() {

  const dispatch = useDispatch();

  const { machine } = useSelector((state) => state.machine);

  const toggleEdit = () => {
    dispatch(setMachineEditFormVisibility(true));
  }
  
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      id:                       machine?._id || "",
      name:                     machine?.name || "",
      serialNo:                 machine?.serialNo || "",
      parentMachine:            machine?.parentMachine?.name || "",
      parentSerialNo:           machine?.parentMachine?.serialNo || "",
      supplier:                 machine?.supplier?.name || "",
      workOrderRef:             machine?.workOrderRef || "",
      machineModel:             machine?.machineModel?.name || "",
      status:                   machine?.status?.name || "",
      customer:                 machine?.customer?.name || "",
      instalationSite:          machine?.instalationSite?.name || "",
      billingSite:              machine?.billingSite?.name || "",
      instalationAddressCity:   machine?.instalationSite?.address?.city || "",  
      instalationAddressCountry:machine?.instalationSite?.address?.country || "",    
      description:              machine?.description || "",
      customerTags:             machine?.customerTags || "",
      accountManager:           machine?.accountManager || "",
      projectManager:           machine?.projectManager || "",
      supportManager:           machine?.supportManager || "",
      createdAt:                machine?.createdAt || "",
      createdByFname:           machine?.createdBy?.firstName || "",
      createdByLname:           machine?.createdBy?.lastName || "",
      createdIP:                machine?.createdIP || "",
      updatedAt:                machine?.updatedAt || "",
      updatedByFname:           machine?.updatedBy?.firstName || "",
      updatedByLname:           machine?.updatedBy?.lastName || "",
      updatedIP:                machine?.updatedIP || "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [machine]
  );


  return (

      <Card sx={{ p: 3 }}>
      {/* <Grid item xs={12} sm={12} > */}
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mb: -4}}>
              <Button
                onClick={() => { toggleEdit(); }}
                variant="contained"
                size="medium"
                startIcon={<Iconify icon="eva:edit-fill" />} >
                Edit Machine
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
                Serial No
                </Typography>
                <Typography variant="body2">{defaultValues.serialNo ? defaultValues.serialNo : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                Parent Machine
                </Typography>
                <Typography variant="body2">{defaultValues.parentMachine ? defaultValues.parentMachine : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                Parent Machine Serial No
                </Typography>
                <Typography variant="body2">{defaultValues.parentSerialNo? defaultValues.parentSerialNo : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                Supplier
                </Typography>
                <Typography variant="body2">{defaultValues.supplier? defaultValues.supplier : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                Machine Model
                </Typography>
                <Typography variant="body2">{defaultValues.supplier? defaultValues.supplier : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                Status
                </Typography>
                <Typography variant="body2">{defaultValues.supplier? defaultValues.supplier : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                Work Order / Perchase Order
                </Typography>
                <Typography variant="body2">{defaultValues.workOrderRef? defaultValues.workOrderRef : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                Customer
                </Typography>
                <Typography variant="body2">{defaultValues.customer? defaultValues.customer : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                Instalation Site
                </Typography>
                <Typography variant="body2">{defaultValues.instalationSite? defaultValues.instalationSite : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                Billing Site
                </Typography>
                <Typography variant="body2">{defaultValues.billingSite? defaultValues.billingSite : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                Site Address
                </Typography>
                <Typography variant="body2">{defaultValues.instalationAddressCity? defaultValues.instalationAddressCity : ''} {defaultValues.instalationAddressCountry? ', ' : null} {defaultValues.instalationAddressCountry? defaultValues.instalationAddressCountry: ''} </Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                Description
                </Typography>
                <Typography variant="body2">{defaultValues.description? defaultValues.description : ''}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                Tags
                </Typography>
                <Typography variant="body2">{defaultValues.customerTags?  Object.values(defaultValues.customerTags).join(",") : ''}</Typography>
            </Grid>
        </Grid>

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
                {/* <Typography variant="body2">{defaultValues.accountManager.firstName} {defaultValues.accountManager.lastName}</Typography> */}
            </Grid>
            <Grid item xs={12} sm={6} sx={{pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                  Project Manager
                </Typography>
                {/* <Typography variant="body2">{defaultValues.projectManager.firstName} {defaultValues.projectManager.lastName}</Typography> */}
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                 Suppport Manager
                </Typography>
                {/* <Typography variant="body2">{defaultValues.supportManager.firstName} {defaultValues.supportManager.lastName}</Typography> */}
            </Grid> 
        </Grid>
        <Grid container>
            <Grid container spacing={0} sx={{  mb:-3,  pt:4}}>
                <Grid item xs={12} sm={6} >
                    <Typography paragraph variant="body2" sx={{ color: 'text.disabled' }}>
                      created by: {defaultValues.createdByFname} {defaultValues.createdByLname}, {fDateTime(defaultValues.createdAt)}, {defaultValues.createdIP}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} >
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                      updated by: {defaultValues.updatedByFname} {defaultValues.updatedByLname}, {fDateTime(defaultValues.updatedAt)}, {defaultValues.updatedIP}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    </Card>
  );
}
