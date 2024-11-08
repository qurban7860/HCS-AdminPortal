import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch } from 'react-redux';
import { Container } from '@mui/material';
import { getServiceReportStatus, resetServiceReportStatus } from '../../../redux/slices/products/serviceReportStatuses';
import ServiceReportStatusEditForm from './ServiceReportStatusEditForm';

// ----------------------------------------------------------------------

export default function StatusEdit() {

  const dispatch = useDispatch();

  const { id } = useParams(); 

  useLayoutEffect(() => {
     dispatch(getServiceReportStatus(id));
     return () => {
      dispatch( resetServiceReportStatus() )
     }
  }, [dispatch, id]);

  
  return (
      <Container maxWidth={false }>
        <ServiceReportStatusEditForm/>
      </Container>
  );
}
