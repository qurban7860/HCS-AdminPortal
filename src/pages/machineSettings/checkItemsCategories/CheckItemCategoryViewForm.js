import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// @mui
import { Card, Grid } from '@mui/material';
// redux
import {
  getServiceCategory,
  deleteServiceCategory,
} from '../../../redux/slices/products/serviceCategory';
import { useSnackbar } from '../../../components/snackbar';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
//  components
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';


// ----------------------------------------------------------------------

export default function CheckItemCategoryViewForm() {
  const { enqueueSnackbar } = useSnackbar();
  
  const navigate = useNavigate();
  const { serviceCategory, isLoading } = useSelector((state) => state.serviceCategory);
  const { id } = useParams();
  
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (id != null) {
      dispatch(getServiceCategory(id));
    }
  }, [dispatch, id ]);

  const defaultValues = useMemo(
    () => ({
      name: serviceCategory?.name || '',
      description: serviceCategory?.description || '',
      isActive: serviceCategory.isActive,
      createdByFullName: serviceCategory?.createdBy?.name || '',
      createdAt: serviceCategory?.createdAt || '',
      createdIP: serviceCategory?.createdIP || '',
      updatedByFullName: serviceCategory?.updatedBy?.name || '',
      updatedAt: serviceCategory?.updatedAt || '',
      updatedIP: serviceCategory?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serviceCategory]
  );

  const toggleEdit = () => navigate(PATH_MACHINE.machineSettings.checkItemCategories.edit(id));

  const onDelete = async () => {
    try {
      await dispatch(deleteServiceCategory(id));
      enqueueSnackbar('Service Category Archived Successfullty!');
      navigate(PATH_MACHINE.machineSettings.checkItemCategories.root);
    } catch (err) {
      enqueueSnackbar('Service Category Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons 
        isActive={defaultValues.isActive} 
        handleEdit={toggleEdit} 
        onDelete={onDelete} 
        backLink={() => navigate(PATH_MACHINE.machineSettings.checkItemCategories.root)}
        machineSettingPage
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={12} heading="Category Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}
