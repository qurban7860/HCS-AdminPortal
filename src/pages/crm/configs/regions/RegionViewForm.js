import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Card, Grid } from '@mui/material';
// redux
import { deleteRegion } from '../../../../redux/slices/region/region';
// paths
import { PATH_SETTING } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import ViewFormAudit from '../../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function RegionViewForm() {
  const { region, isLoading } = useSelector((state) => state.region);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const onDelete = async () => {
    try {
      await dispatch(deleteRegion(region?._id));
      navigate(PATH_SETTING.regions.list);
      enqueueSnackbar('Region Archived Successfully!');
    } catch (error) {
      if (error.Message) {
        enqueueSnackbar(error.Message, { variant: `error` });
      } else if (error.message) {
        enqueueSnackbar(error.message, { variant: `error` });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: `error` });
      }
      enqueueSnackbar('Region Archived failed!', { variant: `error` });
      console.log('Error:', error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_SETTING.regions.edit(region._id));
  };

  const defaultValues = useMemo(
    () => ({
      name: region?.name,
      description: region?.description || '',
      countries: region?.countries,
      isActive: region?.isActive,
      isDefault: region?.isDefault,
      createdAt: region?.createdAt || '',
      createdByFullName: region?.createdBy?.name || '',
      createdIP: region?.createdIP || '',
      updatedAt: region?.updatedAt || '',
      updatedByFullName: region?.updatedBy?.name || '',
      updatedIP: region?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [region]
  );

  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons isActive={defaultValues.isActive}
          handleEdit={handleEdit}
          onDelete={onDelete}
          backLink={() => navigate(PATH_SETTING.regions.list)}
          isDefault={defaultValues.isDefault}
          settingPage
        />
        <Grid container sx={{mt:2}}>
          <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues.name} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Countries" chips={defaultValues?.countries?.map(country => country?.name)} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues.description} />
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}
