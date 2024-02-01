import {  useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Card, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// redux
import { getModule } from '../../../../redux/slices/module/module';
// sections
import { Cover } from '../../../../components/Defaults/Cover';
import ModuleViewForm from './ModuleViewForm';

// ----------------------------------------------------------------------

export default function ModuleView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getModule(id));
  }, [id, dispatch]);

  const { module } = useSelector((state) => state.module );
  return (
      <Container maxWidth={false}>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
          }}
        >
          <Cover name={module?.name} generalSettings />
          
        </Card>
        <ModuleViewForm />
      </Container>
  );
}