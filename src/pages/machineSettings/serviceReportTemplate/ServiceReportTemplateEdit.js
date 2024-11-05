import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch } from 'react-redux';
import { Container } from '@mui/material';
import { getServiceReportTemplate } from '../../../redux/slices/products/serviceReportTemplate';
import CategoryEditForm from './ServiceReportTemplateEditForm';
// redux

// ----------------------------------------------------------------------

export default function ServiceReportTemplateEdit() {
  const dispatch = useDispatch();
  const { id } = useParams(); 
  
  useLayoutEffect(() => {
    dispatch(getServiceReportTemplate(id));
  }, [dispatch, id]);

  
  return (
      <Container maxWidth={false }>
        <CategoryEditForm/>
      </Container>
  );
}
