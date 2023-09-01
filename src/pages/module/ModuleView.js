import {  useLayoutEffect } from 'react';
import { Link as  useParams } from 'react-router-dom';
// @mui
import { Card, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_SETTING } from '../../routes/paths';
// redux
import { getModule } from '../../redux/slices/module/module';
// sections
import { Cover } from '../components/Defaults/Cover';
import ModuleViewForm from './ModuleViewForm';
/* eslint-disable */

// ----------------------------------------------------------------------

export default function ModuleView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getModule(id));
  }, [id, dispatch]);

  const { module } = useSelector((state) => state.module );
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
          <Cover name={module?.name} generalSettings="enabled" backLink={PATH_SETTING.modules.list} />
          
        </Card>
        <ModuleViewForm />
      </Container>
    </>
  );
}