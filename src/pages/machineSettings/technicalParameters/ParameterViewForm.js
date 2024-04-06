import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// @mui
import {  Card, Grid } from '@mui/material';
// redux
import { deleteTechparams } from '../../../redux/slices/products/machineTechParam';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function ParameterViewForm() {

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { techparam, isLoading } = useSelector((state) => state.techparam);
  const navigate = useNavigate();

  const toggleEdit = () => navigate(PATH_MACHINE.machines.machineSettings.technicalParameters.edit(techparam._id));

  const defaultValues = useMemo(
    () => ({
      name: techparam?.name || '',
      code: techparam?.code || [],
      description: techparam?.description || '',
      category: techparam?.category?.name || '',
      isActive: techparam?.isActive,
      isIniRead: techparam?.isIniRead,
      createdByFullName: techparam?.createdBy?.name || '',
      createdAt: techparam?.createdAt || '',
      createdIP: techparam?.createdIP || '',
      updatedByFullName: techparam?.updatedBy?.name || '',
      updatedAt: techparam?.updatedAt || '',
      updatedIP: techparam?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ techparam ]
  );

  const onDelete = () => {
    try {
      dispatch(deleteTechparams(id));
      navigate(PATH_MACHINE.machines.machineSettings.technicalParameters.root);
    } catch (err) {
      enqueueSnackbar('Parameter value delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  return (
  <Grid >
    <StyledCardContainer>
      <Cover
        name={techparam?.name}
        setting
        />
    </StyledCardContainer>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons 
        isActive={defaultValues.isActive} 
        isIniRead={defaultValues.isIniRead}
        handleEdit={toggleEdit} 
        onDelete={onDelete} 
        backLink={() => navigate(PATH_MACHINE.machines.machineSettings.technicalParameters.root)}
        machineSettingPage
        />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={12} heading="Category Name" param={defaultValues?.category} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Code" chips={defaultValues?.code} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  </Grid>
  );
}
