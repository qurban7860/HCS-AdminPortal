import { useMemo } from 'react';
// @mui
import { Card, Grid, Tooltip } from '@mui/material';
// hooks
import { useDispatch, useSelector } from 'react-redux';
// import { fDate } from 'src/utils/formatTime';
// import { fDate } from '../../../utils/formatTime';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import { useSnackbar } from '../../../components/snackbar';
// components
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import {
  setProfileEditFormVisibility,
  getProfile,
  deleteProfile,
  setProfileViewFormVisibility,
  getProfiles,
} from '../../../redux/slices/products/profile';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import { getMachine } from '../../../redux/slices/products/machine';
// constants
// import { Snacks } from '../../../constants/machine-constants';

export default function ProfileViewForm() {
  const { profile } = useSelector((state) => state.profile);

  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
  
  const dispatch = useDispatch();
  const onDelete = async () => {
    try {
      await dispatch(deleteProfile(machine._id, profile._id));
      enqueueSnackbar("Profile deleted successfully");
      dispatch(getProfiles(machine._id))
      dispatch(setProfileViewFormVisibility(false));
      dispatch(getMachine(machine._id))
    } catch (err) {
      enqueueSnackbar("Failed to delete profile", { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleEdit = async () => {
    dispatch(getProfile(machine._id, profile._id));
    dispatch(setProfileViewFormVisibility(false));
    dispatch(setProfileEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => ({
      defaultName: profile?.defaultName || '',
      names:profile?.names || [],
      web:profile?.web || '',
      flange:profile?.flange || '',
      type:profile?.type || '',
      isActive: profile?.isActive || '',
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

  // const profilesString = names.join(', ');
  

  return (
    <Grid item md={12} mt={2}>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive}
      disableEditButton={machine?.status?.slug==='transferred'}
      disableDeleteButton={machine?.status?.slug==='transferred'}
      handleEdit={handleEdit} onDelete={onDelete} backLink={() => dispatch(setProfileViewFormVisibility(false))} />
      <Grid container sx={{mt:2}}>
        <ViewFormField heading="Default Name" param={defaultValues.defaultName} />
        <ViewFormField heading="Other Names" chips={defaultValues.names} />
        <ViewFormField sm={6} heading="Type" param={defaultValues?.type} />
        <ViewFormField sm={6} heading="Web x Flange" param={`${defaultValues?.web}${(defaultValues.web && defaultValues.flange)? " x ":""}${defaultValues?.flange}`} />
        <ViewFormAudit defaultValues={defaultValues} /> 
      </Grid>
    </Card>
    </Grid>
  );
}
