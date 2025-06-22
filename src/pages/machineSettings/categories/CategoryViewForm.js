import PropTypes from 'prop-types';
import {  useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// @mui
import { Card, Grid, Chip } from '@mui/material';
// redux
import {
  getCategory,
  deleteCategory,
} from '../../../redux/slices/products/category';
import { useSnackbar } from '../../../components/snackbar';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
//  components
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

CategoryViewForm.propTypes = {
  currentCategory: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function CategoryViewForm({ currentCategory = null }) {
  const toggleEdit = () => navigate(PATH_MACHINE.machineSettings.categories.edit(id));
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const { category, isLoading } = useSelector((state) => state.category);

  const { id } = useParams();

  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (id != null) {
      dispatch(getCategory(id));
    }
  }, [dispatch, id ]);

  const defaultValues = useMemo(
    () => ({
      name: category?.name || '',
      description: category?.description || '',
      isActive: category.isActive,
      isDefault: category?.isDefault,
      connection: category.connections || false,
      models: category.models?.map((model, index) => ( <Chip sx={{ml:index===0?0:1}} onClick={()=> navigate(PATH_MACHINE.machineSettings.models.view(model?._id))} label={`${model?.name || ''}`} /> )) || [],
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
      enqueueSnackbar('Category Archived Successfullty!');
      navigate(PATH_MACHINE.machineSettings.categories.root);
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
        backLink={() => navigate(PATH_MACHINE.machineSettings.categories.root)}
        isConectable={defaultValues.connection}
        machineSettingPage
        />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={12} heading="Category Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
        <ViewFormField isLoading={isLoading} sm={12} heading='Models' node={<Grid container>{defaultValues.models}</Grid>} />
        {/* <ViewFormSwitch isLoading={isLoading} sm={12} isActiveHeading='Connect as a child' isActive={defaultValues.connection} /> */}
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}
