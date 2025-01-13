import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';
import ChangeReasonViewForm from './ChangeReasonViewForm';
import { getTicketChangeReason } from '../../../../../redux/slices/ticket/ticketSettings/ticketChangeReasons';

// ----------------------------------------------------------------------

export default function ChangeReasonView() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { ticketChangeReason } = useSelector((state) => state.ticketChangeReasons);

  useLayoutEffect(()=>{
    if(id){
      dispatch(getTicketChangeReason(id))
    }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
    <StyledCardContainer>
      <Cover name={ticketChangeReason?.name} />
    </StyledCardContainer>
    <ChangeReasonViewForm />
    </Container>
  );
}
