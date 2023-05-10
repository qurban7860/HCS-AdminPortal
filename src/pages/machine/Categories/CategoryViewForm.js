import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Stack, Typography, Button, Switch } from '@mui/material';
// redux
import { getCategory, setCategoryEditFormVisibility, deleteCategory } from '../../../redux/slices/products/category';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// Iconify
import Iconify from '../../../components/iconify/Iconify';
//  components
import ViewFormAudit from   '../../components/ViewFormAudit';
import ViewFormField from   '../../components/ViewFormField';
import ViewFormSwitch from  '../../components/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

CategoryViewForm.propTypes = {
  currentCategory: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function CategoryViewForm({ currentCategory = null }) {

  const toggleEdit = () => {
    dispatch(setCategoryEditFormVisibility(true));
    navigate(PATH_MACHINE.categories.categoryedit(id));
  }

  const navigate = useNavigate();
  const { category , editFormVisibility } = useSelector((state) => state.category);
  const { id } = useParams();
  
  const dispatch = useDispatch()
    useLayoutEffect(() => {
    if(id != null){
      dispatch(getCategory(id));
    }
  }, [dispatch, id,editFormVisibility]);
  const defaultValues = useMemo(
    () => ({
        name:category?.name || '',
        description:category?.description || '',
        isActive: category.isActive,
        createdByFullName:        category?.createdBy?.fullName || "",
        createdAt:                category?.createdAt || "",
        createdIP:                category?.createdIP || "",
        updatedByFullName:        category?.updatedBy?.fullName || "",
        updatedAt:                category?.updatedAt || "",
        updatedIP:                category?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCategory, category]
    );

    const onDelete= async () => {
      await dispatch(deleteCategory(id));
    }
  return (
    <Card sx={{p:2}}>
            <ViewFormEditDeleteButtons handleEdit={toggleEdit} onDelete={onDelete} />
        <Grid container>
          <ViewFormField sm={6}   heading='Name'          param={defaultValues.name ? defaultValues.name : ''}/>
          <ViewFormField sm={6}   heading='Description'   param={defaultValues.description ? defaultValues.description : ''}/>

          <Grid item xs={12} sm={12} >
            <ViewFormSwitch isActive={defaultValues.isActive}/>
          </Grid>
          <Grid container>
            <ViewFormAudit defaultValues={defaultValues}/>
          </Grid>
        </Grid>
    </Card>
  );
}
