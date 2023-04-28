import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Stack, Typography, Button, Switch } from '@mui/material';
// redux
import { getCategory, setCategoryEditFormVisibility } from '../../../redux/slices/products/category';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// Iconify
import Iconify from '../../../components/iconify/Iconify';
//  components
import ViewFormAudit from '../../components/ViewFormAudit';

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

  return (
    <Card sx={{ px: 5 }}>
      <Stack alignItems="flex-end" sx={{ mt: 2, mb: -4 }}>
        <Button
          onClick={() => { 
              toggleEdit(); 
          }}
          variant="outlined" startIcon={<Iconify icon="eva:edit-fill" />} >
          Edit
        </Button>
      </Stack>
      <Grid container>

        <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Name
          </Typography>
          <Typography variant="body2">{defaultValues.name ? defaultValues.name : ''}</Typography>
        </Grid>

        <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Description
          </Typography>
            <Typography variant="body2">{defaultValues.description ? defaultValues.description : ''}</Typography>
        </Grid>
        
        <Grid item xs={12} sm={12} >
         <Switch sx={{mb:1}} checked = { defaultValues.isActive } disabled  />
        </Grid>

        <Grid container>
          <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>

      </Grid>
    </Card>
  );
}
