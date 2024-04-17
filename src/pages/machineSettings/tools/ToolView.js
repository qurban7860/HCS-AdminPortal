import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
// redux
import { getTool } from '../../../redux/slices/products/tools';
import ToolViewForm from './ToolViewForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';


// ----------------------------------------------------------------------

export default function ToolView() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { tool } = useSelector((state) => state.tool);

  useLayoutEffect(() => {
    dispatch(getTool(id));
  }, [dispatch, id]);

  return (
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover
            name={tool?.name}
            setting
          />
        </StyledCardContainer>
        <ToolViewForm />
      </Container>
  );
}
