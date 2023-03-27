import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { getTechparamcategories, getTechparamcategory } from '../../../redux/slices/products/machineTechParamCategory';
import TechParamCategoryEditForm from './TechParamCategoryEditForm';
// redux

// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections



// ----------------------------------------------------------------------

export default function TechParamCategoryEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams(); 
  console.log(id);

  
  const { techparamcategory } = useSelector((state) => state.techparamcategory);

  useLayoutEffect(() => {
     dispatch(getTechparamcategory(id));
  }, [dispatch, id]);

  
  return (
    <>
      <Helmet>
        <title> Tech Param Category: Edit Page | Machine ERP</title>
      </Helmet>
      

      <Container maxWidth={ false}>
        <TechParamCategoryEditForm/>
      </Container>
    </>
  );
}
