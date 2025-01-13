import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';
import ImpactViewForm from './ImpactViewForm';
import { getTicketImpact } from '../../../../../redux/slices/ticket/ticketSettings/ticketImpacts';

// ----------------------------------------------------------------------

export default function ImpactView() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { ticketImpact } = useSelector((state) => state.ticketImpacts);

  useLayoutEffect(()=>{
    if(id){
      dispatch(getTicketImpact(id))
    }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
    <StyledCardContainer>
      <Cover name={ticketImpact?.name} />
    </StyledCardContainer>
    <ImpactViewForm />
    </Container>
  );
}
