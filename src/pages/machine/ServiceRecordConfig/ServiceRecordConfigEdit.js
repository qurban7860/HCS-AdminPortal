import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { getServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import CategoryEditForm from './ServiceRecordConfigEditForm';
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
  // console.log(id);

  
  const { serviceRecordConfig } = useSelector((state) => state.serviceRecordConfig);

  useLayoutEffect(() => {
    dispatch(getServiceRecordConfig(id));
  }, [dispatch, id]);

  
  return (
    <>
      <Container maxWidth={false }>
        <CategoryEditForm/>
      </Container>
    </>
  );
}
