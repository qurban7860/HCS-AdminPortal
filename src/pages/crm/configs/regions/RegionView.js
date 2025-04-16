import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Card, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// redux
import { getRegion } from '../../../../redux/slices/region/region';
// sections
import { Cover } from '../../../../components/Defaults/Cover';
import RegionViewForm from './RegionViewForm';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function RegionView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getRegion(id));
  }, [id, dispatch]);

  const { region } = useSelector((state) => state.region );
  return (
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={region?.name} />
        </StyledCardContainer>
        <RegionViewForm />
      </Container>
  );
}
