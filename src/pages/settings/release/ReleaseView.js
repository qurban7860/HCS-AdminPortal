import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import ReleaseViewForm from './ReleaseViewForm';
import { getRelease, resetRelease } from '../../../redux/slices/support/release/release';

// ----------------------------------------------------------------------

export default function ReleaseView() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { release } = useSelector((state) => state.release);

  useLayoutEffect(()=>{
    if(id){
      dispatch(getRelease(id))
    }
    return () => { 
      dispatch(resetRelease());
    }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
    <StyledCardContainer>
      <Cover name={release?.name} />
    </StyledCardContainer>
    <ReleaseViewForm />
    </Container>
  );
}
