import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch } from 'react-redux';
// sections
import ParameterViewForm from './ParameterViewForm';
import { getTechparam, resetTechParam } from '../../../redux/slices/products/machineTechParam';

// ----------------------------------------------------------------------

export default function ParameterViewPage() {

  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if(id ){
      dispatch(getTechparam(id));
    }
    return ()=>{
      dispatch(resetTechParam())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  return (
    <Container maxWidth={false}>
      <ParameterViewForm />
    </Container>
  );
}

