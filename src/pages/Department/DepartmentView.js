// @mui
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import DepartmentViewForm from './DepartmentViewForm';
import { Cover } from '../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
/* eslint-disable */


// ----------------------------------------------------------------------

export default function DepartmentView({ editPage }) {
  const { department } = useSelector((state) => state.department);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={department?.departmentName}
          generalSettings
        />
      </StyledCardContainer>
      <DepartmentViewForm />
    </Container>
  );
}
