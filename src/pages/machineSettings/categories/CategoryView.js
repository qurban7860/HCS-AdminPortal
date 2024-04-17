// @mui
import { Container } from '@mui/material';
import {  useSelector } from 'react-redux';
// sections
import CategoryViewForm from './CategoryViewForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function CategoryView() {
  const { category } = useSelector((state) => state.category);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={category?.name}
          setting
        />
      </StyledCardContainer>
      <CategoryViewForm />
    </Container>
  );
}
