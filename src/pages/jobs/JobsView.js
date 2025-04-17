import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import JobsViewForm from './JobsViewForm';
import { getJob, resetJob } from '../../redux/slices/jobs/jobs';

// ----------------------------------------------------------------------

export default function JobsView() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { job } = useSelector((state) => state.jobs);

  useLayoutEffect(()=>{
    if(id){
      dispatch(getJob(id));
    }
    return () => { 
      dispatch(resetJob());
    }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
    <StyledCardContainer>
      <Cover name={job?.profile} />
    </StyledCardContainer>
    <JobsViewForm />
    </Container>
  );
}
