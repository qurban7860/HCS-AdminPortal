// @mui
import { useLayoutEffect } from 'react';
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import DepartmentViewForm from './DepartmentViewForm';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { getDepartment } from '../../../../redux/slices/department/department';

// ----------------------------------------------------------------------

export default function DepartmentView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { department } = useSelector((state) => state.department);

  useLayoutEffect(() => {
    if (id != null) {
      dispatch(getDepartment(id));
    }
  }, [dispatch, id ]);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={department?.departmentName || ''}
        />
      </StyledCardContainer>
      <DepartmentViewForm />
    </Container>
  );
}
