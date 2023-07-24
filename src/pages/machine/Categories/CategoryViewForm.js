import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// @mui
import { Card, Grid, Stack, Typography, Button, Switch } from '@mui/material';
import { RHFSwitch } from '../../../components/hook-form';
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
import Iconify from '../../../components/iconify/Iconify';
//  components
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormSwitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';

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
  const { category, editFormVisibility } = useSelector((state) => state.category);
  console.log("category : ", category)
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
      connection: category.connections || false,
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
      // if(err.Message){
      //   enqueueSnackbar(err.Message,{ variant: `error` })
      // }else if(err.message){
      //   enqueueSnackbar(err.message,{ variant: `error` })
      // }else{
      //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
      // }
      enqueueSnackbar('Category delete failed!', { variant: `error` });
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
        <ViewFormSwitch sm={12} isActiveHeading='Connect as a child' isActive={defaultValues.connection} />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}
