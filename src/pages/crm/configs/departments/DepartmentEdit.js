import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, } from 'react-redux';
import { Container } from '@mui/material';
import DepartmentEditForm from './DepartmentEditForm';
import { getConfigs } from '../../../../redux/slices/config/config';
import { getDepartment } from '../../../../redux/slices/department/department';

export default function DepartmentEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(getDepartment(id));
    dispatch(getConfigs());
  }, [dispatch, id]);

  return (
      <Container maxWidth={false }>
        <DepartmentEditForm/>
      </Container>
  );
}
