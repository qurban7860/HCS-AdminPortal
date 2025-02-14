import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';
import RequestTypeViewForm from './RequestTypeViewForm';
import { getTicketRequestType, resetTicketRequestType } from '../../../../../redux/slices/ticket/ticketSettings/ticketRequestTypes';

// ----------------------------------------------------------------------

export default function RequestTypeView() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { ticketRequestType } = useSelector((state) => state.ticketRequestTypes);

  useLayoutEffect(()=>{
    if(id){
      dispatch(getTicketRequestType(id));
    }
    return () => { 
      dispatch(resetTicketRequestType());
    }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
    <StyledCardContainer>
      <Cover name={ticketRequestType?.name} />
    </StyledCardContainer>
    <RequestTypeViewForm />
    </Container>
  );
}
