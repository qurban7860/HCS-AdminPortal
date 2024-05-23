// @mui
import { useLayoutEffect } from 'react';
import { Container, Card } from '@mui/material';
// redux
import { useDispatch } from 'react-redux';
import {  useParams } from 'react-router-dom';
import SecurityUserEditForm from './SecurityUserEditForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { getSecurityUser } from '../../../redux/slices/securityUser/securityUser';

// ----------------------------------------------------------------------

export default function SecurityUserEdit() {

  const dispatch = useDispatch();
  const { id } = useParams();
  
  useLayoutEffect(() => {
    if (id) {
      dispatch(getSecurityUser(id));
    }
  },[dispatch, id]);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Edit User"/>
      </StyledCardContainer>
      <SecurityUserEditForm />
    </Container>
  );
}
