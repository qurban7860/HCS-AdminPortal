import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';
import StatusViewForm from './StatusViewForm';
import { getTicketStatus, resetTicketStatus } from '../../../../../redux/slices/ticket/ticketSettings/ticketStatuses';

// ----------------------------------------------------------------------

export default function StatusView() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { ticketStatus } = useSelector((state) => state.ticketStatuses);

  useLayoutEffect(()=>{
    if(id){
      dispatch(getTicketStatus(id));
    }
    return () => { 
      dispatch(resetTicketStatus());
    }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
    <StyledCardContainer>
      <Cover name={ticketStatus?.name} />
    </StyledCardContainer>
    <StatusViewForm />
    </Container>
  );
}
