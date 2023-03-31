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
import ViewFormSubtitle from '../components/ViewFormSubtitle';
// slices
import { getMachines, getMachine, setMachineEditFormVisibility } from '../../redux/slices/products/machine';


import ViewFormField from '../components/ViewFormField';
import ViewFormAudit from '../components/ViewFormAudit';

// ----------------------------------------------------------------------

export default function CustomerViewForm() {

  const dispatch = useDispatch();

  const { machine , machineEditFormFlag } = useSelector((state) => state.machine);
  useLayoutEffect(() => {
    dispatch(setMachineEditFormVisibility(false))
  }, [ dispatch ,machine ])

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
                onClick={toggleEdit}
                variant="contained"
                size="medium"
                startIcon={<Iconify icon="eva:edit-fill" />} >
                Edit Machine
              </Button>
        </Stack>
      {/* </Grid> */}
        <Grid container>
            <ViewFormField sm={6} heading="Serial No" param={defaultValues.serialNo ? defaultValues.serialNo : ''} />
            <ViewFormField sm={6} heading="Name" param={defaultValues.name} />
            <ViewFormField sm={6} heading="Previous Machine Serial No" param={defaultValues.parentSerialNo? defaultValues.parentSerialNo : ''} />
            <ViewFormField sm={6} heading="Previous Machine" param={defaultValues.parentMachine ? defaultValues.parentMachine : ''} />
            <ViewFormField sm={6} heading="Supplier" param={defaultValues.supplier? defaultValues.supplier : ''} />
            <ViewFormField sm={6} heading="Machine Model" param={defaultValues.machineModel? defaultValues.machineModel : ''} />
            <ViewFormField sm={6} heading="Status" param={defaultValues.status? defaultValues.status : ''} />
            <ViewFormField sm={6} heading="Work Order / Perchase Order" param={defaultValues.workOrderRef? defaultValues.workOrderRef : ''} />
            <ViewFormField sm={6} heading="Customer" param={defaultValues.customer? defaultValues.customer : ''} />
            <ViewFormField sm={6} heading="Instalation Site" param={defaultValues.instalationSite? defaultValues.instalationSite : ''} />
            <ViewFormField sm={6} heading="Billing Site" param={defaultValues.billingSite? defaultValues.billingSite : ''} />
            <ViewFormField sm={6} heading="Site Address" param={defaultValues.instalationAddressCity? defaultValues.instalationAddressCity : ''} />
            <ViewFormField sm={12} heading="Description" param={defaultValues.description? defaultValues.description : ''} />
            <ViewFormField sm={6} heading="Tags" param={defaultValues.customerTags?  Object.values(defaultValues.customerTags).join(",") : ''} />
        </Grid>

        <Grid container>
            <ViewFormSubtitle sm={12} heading="Howick Resources"/>
            <ViewFormField sm={6} heading="Account Manager" param={defaultValues?.accountManager?.firstName || ""} secondParam={defaultValues?.accountManager?.lastName || ""}/>
            <ViewFormField sm={6} heading="Project Manager" param={defaultValues?.projectManager?.firstName || "" } secondParam={defaultValues?.projectManager?.lastName || ""}/>
            <ViewFormField sm={6} heading="Suppport Manager" param={defaultValues?.supportManager?.firstName || "" } secondParam={defaultValues?.supportManager?.lastName || ""}/> 
        </Grid>
        <Grid container>
            <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>
    </Card>
  );
}
