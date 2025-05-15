import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';
import FaultViewForm from './FaultViewForm';
import { getTicketFault, resetTicketFault} from '../../../../../redux/slices/ticket/ticketSettings/ticketFaults';

// ----------------------------------------------------------------------

export default function FaultView() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { ticketFault } = useSelector((state) => state.ticketFaults);

  useLayoutEffect(()=>{
    if(id){
      dispatch(getTicketFault(id));
    }
    return () => { 
      dispatch(resetTicketFault());
    }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
    <StyledCardContainer>
      <Cover name={ticketFault?.name} />
    </StyledCardContainer>
    <FaultViewForm />
    </Container>
  );
}
