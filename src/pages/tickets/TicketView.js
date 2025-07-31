import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// redux
import { getTicket, getTicketSettings, resetTicket } from '../../redux/slices/ticket/tickets';
// sections
import { Cover } from '../../components/Defaults/Cover';
import TicketViewForm from './TicketViewForm';
import { StyledCardContainer } from '../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function TicketView() {
  const dispatch = useDispatch();
  const configurations = JSON.parse(localStorage.getItem('configurations'));
  const prefix = configurations?.find((config) => config?.name?.toLowerCase() === 'ticket_prefix')?.value || '';

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getTicket(id));
    dispatch(getTicketSettings());
    return () => {
      dispatch(resetTicket());
    }
  }, [id, dispatch]);

  const { ticket } = useSelector((state) => state.tickets);
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
      <Cover name={`${prefix || ''} - ${ticket?.ticketNo || ''}`} />
      </StyledCardContainer>
      <TicketViewForm />
    </Container>
  );
}
