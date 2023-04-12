import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Stack, Typography, Button, Switch } from '@mui/material';
// redux
import { getCategory, getCategories, setEditFormVisibility } from '../../../redux/slices/products/category';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// Iconify
import { fDate } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify/Iconify';

// ----------------------------------------------------------------------

CategoryViewForm.propTypes = {
  currentCategory: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function CategoryViewForm({ currentCategory = null }) {

  const toggleEdit = () => {
    dispatch(setEditFormVisibility(true));
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
        isActive: category.isActive || true,
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
          <Typography variant="body2">{defaultValues.name ? defaultValues.name : 'N/A'}</Typography>
        </Grid>

        <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Description
          </Typography>
            <Typography variant="body2">{defaultValues.description ? defaultValues.description : 'N/A'}</Typography>
        </Grid>
        
        <Grid item xs={12} sm={12} >
         <Switch sx={{mb:1}} checked = { defaultValues.isDisabled } disabled  />
        </Grid>

        <Grid container spacing={0} sx={{ mb: 5}}>
            <Grid item xs={12} sm={6} >
              <Typography paragraph variant="body2" sx={{ color: 'text.disabled' }}>
                created by: Naveed, {fDate(defaultValues.createdAt)}, 192.168.10.101
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} >
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              updated by: Naveed, {fDate(defaultValues.updatedAt)}, 192.168.10.101
            </Typography>
            </Grid>
        </Grid>

      </Grid>
    </Card>
  );
}
