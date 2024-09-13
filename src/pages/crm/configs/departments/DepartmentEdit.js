import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, } from 'react-redux';
import { Container } from '@mui/material';
import DepartmentEditForm from './DepartmentEditForm';
import { getDepartment } from '../../../../redux/slices/department/department';

export default function DepartmentEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(getDepartment(id));
  }, [dispatch, id]);

  return (
      <Container maxWidth={false }>
        <DepartmentEditForm/>
      </Container>
  );
}
