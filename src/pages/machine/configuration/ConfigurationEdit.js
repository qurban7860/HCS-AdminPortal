import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import {  getCategory } from '../../../redux/slices/products/category';
import CategoryEditForm from './ConfigurationEditForm';
// redux

// routes
// import { PATH_MACHINE } from '../../../routes/paths';
// components
// import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
// import { useSettingsContext } from '../../../components/settings';
// sections



// ----------------------------------------------------------------------

export default function ConfigurationEdit() {
  // const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams(); 
  // console.log(id);

  
   useSelector((state) => state.category);

  useLayoutEffect(() => {
    dispatch(getCategory(id));
  }, [dispatch, id]);

  
  return (
      <Container maxWidth={false }>
        <CategoryEditForm/>
      </Container>
  );
}
