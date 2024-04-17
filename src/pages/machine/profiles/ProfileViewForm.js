import { useLayoutEffect, useMemo } from 'react';
// @mui
import { Container, Card, Grid } from '@mui/material';
// hooks
import { useDispatch, useSelector } from 'react-redux';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// components
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import { useSnackbar } from '../../../components/snackbar';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import {
  getProfile,
  deleteProfile,
} from '../../../redux/slices/products/profile';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import MachineTabContainer from '../util/MachineTabContainer';

export default function ProfileViewForm() {
  const { profile, isLoading} = useSelector((state) => state.profile);
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { machineId, id } = useParams();
  const dispatch = useDispatch();

  useLayoutEffect(()=>{
    if(machineId && id ){
      dispatch(getProfile(machineId, id ))
    }
  },[ dispatch, machineId, id ])
  
  const onDelete = async () => {
    try {
      await dispatch(deleteProfile(machineId, id));
      enqueueSnackbar("Profile deleted successfully");
      navigate(PATH_MACHINE.machines.profiles.root( machineId ))
    } catch (err) {
      enqueueSnackbar("Failed to delete profile", { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleEdit = () => navigate(PATH_MACHINE.machines.profiles.edit( machineId, id )) ;

  const defaultValues = useMemo(
    () => ({
      defaultName: profile?.defaultName || '',
      names:profile?.names || [],
      web:profile?.web || '',
      flange:profile?.flange || '',
      thicknessStart: profile?.thicknessStart || '',
      thicknessEnd: profile?.thicknessEnd || '',
      type:profile?.type || '',
      isActive: profile?.isActive,
      createdByFullName: profile?.createdBy?.name || '',
      createdAt: profile?.createdAt || '',
      createdIP: profile?.createdIP || '',
      updatedByFullName: profile?.updatedBy?.name || '',
      updatedAt: profile?.updatedAt || '',
      updatedIP: profile?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, machine]
  );

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='profile' />
    <Grid item md={12} mt={2}>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive}
        disableEditButton={machine?.status?.slug==='transferred'}
        disableDeleteButton={machine?.status?.slug==='transferred'}
        handleEdit={handleEdit} 
        onDelete={onDelete} 
        backLink={() => navigate(PATH_MACHINE.machines.profiles.root( machineId))} 
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={6} heading="Default Name" param={defaultValues.defaultName} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Type" param={defaultValues?.type} />
        <ViewFormField isLoading={isLoading} heading="Other Names" chips={defaultValues.names} />
        <ViewFormField isLoading={isLoading} sm={2} heading="Web" param={`${defaultValues?.web || '' }`} />
        <ViewFormField isLoading={isLoading} sm={2} heading="Flange" param={`${defaultValues?.flange || '' }`} />
        <ViewFormField isLoading={isLoading} sm={2} heading="Min. Thickness" param={`${defaultValues?.thicknessStart || '' } `} />
        <ViewFormField isLoading={isLoading} sm={2} heading="Max. Thickness" param={`${defaultValues?.thicknessEnd || '' } `} />

        <ViewFormAudit defaultValues={defaultValues} /> 
      </Grid>
    </Card>
    </Grid>
    </Container>
  );
}
