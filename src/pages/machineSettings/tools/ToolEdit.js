import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container } from '@mui/material';
import { getTool } from '../../../redux/slices/products/tools';
import ToolEditForm from './ToolEditForm';

// ----------------------------------------------------------------------

export default function ToolEdit() {
  const dispatch = useDispatch();
  const { id } = useParams(); 

  useLayoutEffect(() => {
    dispatch(getTool(id));
  }, [dispatch, id]);
  
  return (
      <Container maxWidth={false }>
        <ToolEditForm/>
      </Container>
  );
}
