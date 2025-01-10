import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function ImpactView() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { ticketCollection } = useSelector((state) => state.ticketCollection);

  useLayoutEffect(()=>{
    if(id){
      // dispatch(getTicketCollection(id))
    }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
    <StyledCardContainer>
      <Cover  name={ticketCollection?.name} />
    </StyledCardContainer>
    </Container>
  );
}
