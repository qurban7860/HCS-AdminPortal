import { useParams } from 'react-router-dom';
import { useLayoutEffect } from 'react';
// @mui
import { Container , Card } from '@mui/material';
// redux
import { useDispatch} from '../../redux/store';
import { getSecurityUser } from '../../redux/slices/securityUser/securityUser';
// sections
import UserEditForm from './SecurityUserEditForm';
import {Cover} from '../components/Cover';

// ----------------------------------------------------------------------

export default function SecurityUserEdit() {

  const dispatch = useDispatch();
  const { id } = useParams(); 
  useLayoutEffect(() => {
    dispatch(getSecurityUser(id));
  }, [dispatch, id]);
  return (
      <Container maxWidth={false}>
        <Card sx={{mb: 3,height: 160,position: 'relative',}}>
          <Cover name="Edit User" icon='mdi:user-circle'/>
        </Card>
        <UserEditForm />
      </Container>
  );
}
