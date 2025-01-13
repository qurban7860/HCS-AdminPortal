import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';
import ChangeTypeViewForm from './ChangeTypeViewForm';
import { getTicketChangeType } from '../../../../../redux/slices/ticket/ticketSettings/ticketChangeTypes';

// ----------------------------------------------------------------------

export default function ChangeTypeView() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { ticketChangeType } = useSelector((state) => state.ticketChangeTypes);

  useLayoutEffect(()=>{
    if(id){
      dispatch(getTicketChangeType(id))
    }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
    <StyledCardContainer>
      <Cover name={ticketChangeType?.name} />
    </StyledCardContainer>
    <ChangeTypeViewForm />
    </Container>
  );
}
