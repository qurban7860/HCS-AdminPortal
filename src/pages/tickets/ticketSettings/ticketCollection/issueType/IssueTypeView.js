import {  useLayoutEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// sections
import { Cover } from '../../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../../theme/styles/default-styles';
import IssueTypeViewForm from './IssueTypeViewForm';
import { getTicketIssueType } from '../../../../../redux/slices/ticket/ticketSettings/ticketIssueTypes';

// ----------------------------------------------------------------------

export default function IssueTypeView() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { ticketIssueType } = useSelector((state) => state.ticketIssueTypes);

  useLayoutEffect(()=>{
    if(id){
      dispatch(getTicketIssueType(id))
    }
  },[dispatch, id ])

  return (
    <Container maxWidth={false}>
    <StyledCardContainer>
      <Cover name={ticketIssueType?.name} />
    </StyledCardContainer>
    <IssueTypeViewForm />
    </Container>
  );
}
