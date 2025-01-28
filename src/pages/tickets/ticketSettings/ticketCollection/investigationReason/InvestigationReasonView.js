import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';
import InvestigationReasonViewForm from './InvestigationReasonViewForm';
import { getTicketInvestigationReason, resetTicketInvestigationReason } from '../../../../../redux/slices/ticket/ticketSettings/ticketInvestigationReasons';

// ----------------------------------------------------------------------

export default function InvestigationReasonView() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { ticketInvestigationReason } = useSelector((state) => state.ticketInvestigationReasons);

  useLayoutEffect(()=>{
    if(id){
      dispatch(getTicketInvestigationReason(id))
    }
    return () => { resetTicketInvestigationReason() }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
    <StyledCardContainer>
      <Cover name={ticketInvestigationReason?.name} />
    </StyledCardContainer>
    <InvestigationReasonViewForm />
    </Container>
  );
}
