import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';
import PriorityViewForm from './PriorityViewForm';
import { getTicketPriority } from '../../../../../redux/slices/ticket/ticketSettings/ticketPriorities';

// ----------------------------------------------------------------------

export default function PriorityView() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { ticketPriority } = useSelector((state) => state.ticketPriorities);

  useLayoutEffect(()=>{
    if(id){
      dispatch(getTicketPriority(id))
    }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
    <StyledCardContainer>
      <Cover name={ticketPriority?.name} />
    </StyledCardContainer>
    <PriorityViewForm />
    </Container>
  );
}
