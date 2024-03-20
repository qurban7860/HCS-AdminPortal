// import { Helmet } from 'react-helmet-async';
// import { useLayoutEffect } from 'react';
// import { useParams } from 'react-router-dom';
// // @mui
// import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import DepartmentEditForm from './DepartmentEditForm';

export default function DepartmentEdit() {
  return (
      <Container maxWidth={false }>
        <DepartmentEditForm/>
      </Container>
  );
}
