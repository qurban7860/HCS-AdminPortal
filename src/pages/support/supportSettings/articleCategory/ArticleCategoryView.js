import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';
// redux
import {
  getArticleCategory,
} from '../../../../redux/slices/support/supportSettings/articleCategory';
// paths
import { PATH_SUPPORT } from '../../../../routes/paths';
// components
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { Cover } from '../../../../components/Defaults/Cover';
import ArticleCategoryViewForm from './ArticleCategoryViewForm';

// ----------------------------------------------------------------------

export default function ArticleCategoryView() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { articleCategory } = useSelector((state) => state.articleCategory);

  useEffect(() => {
    dispatch(getArticleCategory(id));
  }, [id, dispatch]);


  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={articleCategory?.name} isArchived={articleCategory?.isArchived} />
      </StyledCardContainer>
      <ArticleCategoryViewForm />
    </Container>
  );
}
