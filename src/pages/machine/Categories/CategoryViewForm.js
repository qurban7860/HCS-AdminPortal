import PropTypes from 'prop-types';
import {  useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// @mui
import { Card, Grid, Chip } from '@mui/material';
// import { RHFSwitch } from '../../../components/hook-form';
// redux
import {
  getCategory,
  setCategoryEditFormVisibility,
  deleteCategory,
} from '../../../redux/slices/products/category';
import { useSnackbar } from '../../../components/snackbar';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// Iconify
// import Iconify from '../../../components/iconify/Iconify';
//  components
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormSwitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
// import ToggleButtons from '../../components/DocumentForms/ToggleButtons';

// ----------------------------------------------------------------------

CategoryViewForm.propTypes = {
  currentCategory: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function CategoryViewForm({ currentCategory = null }) {
  const toggleEdit = () => {
    dispatch(setCategoryEditFormVisibility(true));
    navigate(PATH_MACHINE.machines.settings.categories.categoryedit(id));
  };
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const { category, editFormVisibility, isLoading } = useSelector((state) => state.category);
  // console.log("category : ", category)
  const { id } = useParams();

  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (id != null) {
      dispatch(getCategory(id));
    }
  }, [dispatch, id, editFormVisibility]);
  const defaultValues = useMemo(
    () => ({
      name: category?.name || '',
      description: category?.description || '',
      isActive: category.isActive,
      isDefault: category?.isDefault,
      connection: category.connections || false,
      models: category.models?.map((model, index) => ( <Chip sx={{ml:index===0?0:1}} onClick={()=> navigate(PATH_MACHINE.machines.settings.model.view(model?._id))} label={`${model?.name || ''}`} /> )) || [],
      createdByFullName: category?.createdBy?.name || '',
      createdAt: category?.createdAt || '',
      createdIP: category?.createdIP || '',
      updatedByFullName: category?.updatedBy?.name || '',
      updatedAt: category?.updatedAt || '',
      updatedIP: category?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCategory, category]
  );

  const onDelete = async () => {
    try {
      await dispatch(deleteCategory(id));
      enqueueSnackbar('Category Deleted Successfullty!');
      navigate(PATH_MACHINE.machines.settings.categories.list);
    } catch (err) {
      enqueueSnackbar(err, { variant: `error` });
      console.log('Error:', err);
    }
  };
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons 
        isActive={defaultValues.isActive} 
        isDefault={defaultValues.isDefault} 
        handleEdit={toggleEdit} 
        onDelete={onDelete} 
        backLink={() => navigate(PATH_MACHINE.machines.settings.categories.list)}
        isConectable={defaultValues.connection}
        />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={12} heading="Category Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
        <ViewFormField isLoading={isLoading} sm={12} heading='Models' chipDialogArrayParam={defaultValues.models} />
        {/* <ViewFormSwitch isLoading={isLoading} sm={12} isActiveHeading='Connect as a child' isActive={defaultValues.connection} /> */}
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}
