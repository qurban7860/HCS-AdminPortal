import { useLayoutEffect} from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Card, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_SETTING } from '../../routes/paths';
// redux
import { getConfig } from '../../redux/slices/config/config';
// sections
import { Cover } from '../../components/Defaults/Cover';
import ConfigViewForm from './ConfigViewForm';
/* eslint-disable */

// ----------------------------------------------------------------------

export default function ConfigView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getConfig(id));
  }, [id, dispatch]);

  const { config, isLoading } = useSelector((state) => state.config );
  return (
    <>
      <Container maxWidth={false}>
        <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
          <Cover name={isLoading?"":config?.name} generalSettings />
        </Card>
        <ConfigViewForm />
      </Container>
    </>
  );
}
