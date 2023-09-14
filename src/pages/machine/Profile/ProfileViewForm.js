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
} from '../../../redux/slices/products/profile';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
// constants
// import { Snacks } from '../../../constants/machine-constants';

export default function ProfileViewForm() {
  const { profile } = useSelector((state) => state.profile);

  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
  
  const dispatch = useDispatch();
  const onDelete = async () => {
    try {
      dispatch(deleteProfile(machine._id, profile._id));
      enqueueSnackbar("Profile deleted successfully");
      dispatch(setProfileViewFormVisibility(false));
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
      height:profile?.height || '',
      width:profile?.width || '',
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
      <ViewFormEditDeleteButtons handleEdit={handleEdit} onDelete={onDelete} />
      <Grid display="inline-flex">
        <Tooltip>
          <ViewFormField isActive={defaultValues.isActive} />
        </Tooltip>
      </Grid>
      <Grid container>
        <ViewFormField heading="Default Name" param={defaultValues.defaultName} />
        <ViewFormField heading="Other Names" chips={defaultValues.names} />
        <ViewFormField sm={6} heading="Type" param={defaultValues?.type} />
        <ViewFormField sm={6} heading="Web X Flang" param={`${defaultValues?.height}${(defaultValues.height && defaultValues.width)? "X":""}${defaultValues?.width}`} />
        <ViewFormAudit defaultValues={defaultValues} /> 
      </Grid>
    </Card>
    </Grid>
  );
}
