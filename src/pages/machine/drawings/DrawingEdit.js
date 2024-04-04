import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { getDrawing } from '../../../redux/slices/products/drawing';
import DrawingEditForm from './DrawingEditForm';
// redux
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function DrawingEdit() {

  const dispatch = useDispatch();
  const { id } = useParams(); 
  const { drawing } = useSelector((state) => state.drawing);

  useEffect(() => {
     dispatch(getDrawing(id));
  }, [dispatch, id]);

  return (
      <Container maxWidth={false }>
                <MachineTabContainer currentTabValue='drawings' />
        <DrawingEditForm/>
      </Container>
  );
}
