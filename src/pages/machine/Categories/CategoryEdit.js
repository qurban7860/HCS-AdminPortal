import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { getCategories, getCategory } from '../../../redux/slices/category';
import CategoryEditForm from './CategoryEditForm';
// redux

// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections



// ----------------------------------------------------------------------

export default function CategoryEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams(); 
  console.log(id);

  
  const { category } = useSelector((state) => state.category);

  useLayoutEffect(() => {
    dispatch(getCategory(id));
  }, [dispatch, id]);

  
  return (
    <>
      <Helmet>
        <title> Category: Edit Page | Machine ERP</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Category"
          sx={{ mb: -2, mt: 3 }}
        />

        <CategoryEditForm/>
      </Container>
    </>
  );
}
