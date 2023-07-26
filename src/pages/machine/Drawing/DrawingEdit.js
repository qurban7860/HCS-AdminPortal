import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { getDrawing } from '../../../redux/slices/products/drawing';
import DrawingEditForm from './DrawingEditForm';
// redux
import { useDispatch,useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function ModelEdit() {

  const dispatch = useDispatch();
  const { id } = useParams(); 
  const { drawing } = useSelector((state) => state.drawing);

  useEffect(() => {
     dispatch(getDrawing(id));
  }, [dispatch, id]);

  return (
    <>
      <Container maxWidth={false }>
        <DrawingEditForm/>
      </Container>
    </>
  );
}
