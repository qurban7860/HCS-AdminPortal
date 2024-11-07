import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch } from 'react-redux';
import { Container } from '@mui/material';
import { getMachineStatus} from '../../../redux/slices/products/statuses';
import ServiceReportStatusEditForm from './ServiceReportStatusEditForm';

// ----------------------------------------------------------------------

export default function StatusEdit() {

  const dispatch = useDispatch();

  const { id } = useParams(); 

  useLayoutEffect(() => {
     dispatch(getMachineStatus(id));
  }, [dispatch, id]);

  
  return (
      <Container maxWidth={false }>
        <ServiceReportStatusEditForm/>
      </Container>
  );
}
