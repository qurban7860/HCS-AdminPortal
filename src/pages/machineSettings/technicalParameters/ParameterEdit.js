import { useEffect } from 'react';
import { Container } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getTechparam, resetTechParam } from '../../../redux/slices/products/machineTechParam';
import ParameterEditForm from './ParameterEditForm';

// ----------------------------------------------------------------------

export default function ParameterEdit() {
  
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if(id ){
      dispatch(getTechparam(id));
    }
    return ()=>{
      dispatch(resetTechParam())
    }
  }, [dispatch, id]);

  return (
      <Container maxWidth={false }>
        <ParameterEditForm/>
      </Container>
  );
}
