import PropTypes from 'prop-types';
import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// @mui
import { Card, Grid } from '@mui/material';
// import { RHFSwitch } from '../../../components/hook-form';
// redux
import {
  getServiceCategory,
  setServiceCategoryEditFormVisibility,
  deleteServiceCategory,
} from '../../../redux/slices/products/serviceCategory';
import { useSnackbar } from '../../../components/snackbar';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// Iconify
// import Iconify from '../../../components/iconify/Iconify';
//  components
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
// import ViewFormSwitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
// import ToggleButtons from '../../components/DocumentForms/ToggleButtons';

// ----------------------------------------------------------------------

ServiceCategoryViewForm.propTypes = {
  currentCategory: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function ServiceCategoryViewForm({ currentCategory = null }) {
  const toggleEdit = () => {
    dispatch(setServiceCategoryEditFormVisibility(true));
    navigate(PATH_MACHINE.machines.settings.serviceCategories.edit(id));
  };
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const { serviceCategory, editFormVisibility } = useSelector((state) => state.serviceCategory);
  const { id } = useParams();

  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (id != null) {
      dispatch(getServiceCategory(id));
    }
  }, [dispatch, id, editFormVisibility]);
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
    [currentCategory, serviceCategory]
  );

  const onDelete = async () => {
    try {
      await dispatch(deleteServiceCategory(id));
      enqueueSnackbar('Service Category Deleted Successfullty!');
      navigate(PATH_MACHINE.machines.settings.serviceCategories.list);
    } catch (err) {
      enqueueSnackbar('Service Category delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons handleEdit={toggleEdit} onDelete={onDelete} />
      <Grid container>
        <ViewFormField sm={12} isActive={defaultValues.isActive} />
        <ViewFormField sm={12} heading="Category Name" param={defaultValues?.name} />
        <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}
