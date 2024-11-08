import PropTypes from 'prop-types';
import {  useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import { deleteServiceReportStatus } from '../../../redux/slices/products/serviceReportStatuses';
// Iconify
// import Iconify from '../../../components/iconify/Iconify';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function ServiceReportStatusViewForm( ) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { serviceReportStatus, isLoading } = useSelector((state) => state.serviceReportStatuses);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: serviceReportStatus?.name || '',
      type: serviceReportStatus?.type || '',
      displayOrderNo: serviceReportStatus?.displayOrderNo || '',
      description: serviceReportStatus?.description || '',
      isActive: serviceReportStatus?.isActive,
      isDefault: serviceReportStatus?.isDefault,
      createdByFullName: serviceReportStatus?.createdBy?.name || '',
      createdAt: serviceReportStatus?.createdAt || '',
      createdIP: serviceReportStatus?.createdIP || '',
      updatedByFullName: serviceReportStatus?.updatedBy?.name || '',
      updatedAt: serviceReportStatus?.updatedAt || '',
      updatedIP: serviceReportStatus?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ serviceReportStatus]
  );

  const onDelete = () => {
    try {
      dispatch(deleteServiceReportStatus(id));
      navigate(PATH_MACHINE.machines.machineSettings.serviceReportsStatus.root);
    } catch (err) {
      enqueueSnackbar('Status Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_MACHINE.machines.machineSettings.serviceReportsStatus.edit(id));

  return (
  <Grid>
    <StyledCardContainer>
      <Cover
        name={serviceReportStatus?.name}
        setting
        />
    </StyledCardContainer>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons 
        isActive={defaultValues.isActive} 
        isDefault={defaultValues.isDefault} 
        handleEdit={toggleEdit} 
        onDelete={onDelete} b
        backLink={() => navigate(PATH_MACHINE.machines.machineSettings.serviceReportsStatus.root)} 
        machineSettingPage
        />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={12} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Type" param={defaultValues?.type} />
        <ViewFormField isLoading={isLoading}
          sm={12}
          heading="Display Order No."
          param={defaultValues?.displayOrderNo?.toString()}
          />
        <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
        <Grid container>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  </Grid>
  );
}
