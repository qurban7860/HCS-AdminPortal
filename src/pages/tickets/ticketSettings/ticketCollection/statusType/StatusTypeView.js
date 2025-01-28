import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';
import StatusTypeViewForm from './StatusTypeViewForm';
import { getTicketStatusType, resetTicketStatusType } from '../../../../../redux/slices/ticket/ticketSettings/ticketStatusTypes';

// ----------------------------------------------------------------------

export default function StatusTypeView() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { ticketStatusType } = useSelector((state) => state.ticketStatusTypes);

  useLayoutEffect(()=>{
    if(id){
      dispatch(getTicketStatusType(id))
    }
    return () => { resetTicketStatusType() }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
    <StyledCardContainer>
      <Cover name={ticketStatusType?.name} />
    </StyledCardContainer>
    <StatusTypeViewForm />
    </Container>
  );
}
