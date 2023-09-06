import { useLayoutEffect} from 'react';
import { Link as useParams } from 'react-router-dom';
// @mui
import { Card, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_SETTING } from '../../routes/paths';
// redux
import { getConfig } from '../../redux/slices/config/config';
// sections
import { Cover } from '../components/Defaults/Cover';
import ConfigViewForm from './ConfigViewForm';
/* eslint-disable */

// ----------------------------------------------------------------------

export default function ConfigView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getConfig(id));
  }, [id, dispatch]);

  const { config } = useSelector((state) => state.config );
  // console.log("role : ",role)
  return (
    <>
      <Container maxWidth={false}>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
            // mt: '24px',
          }}
        >
          <Cover name={config?.name} generalSettings="enabled" backLink={PATH_SETTING.configs.list} />
        </Card>
        <ConfigViewForm />
      </Container>
    </>
  );
}
