import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';
// redux
import {
  getArticleCategory,
  resetArticleCategory
} from '../../../../redux/slices/support/supportSettings/articleCategory';
// paths
import { PATH_SUPPORT } from '../../../../routes/paths';
// components
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { Cover } from '../../../../components/Defaults/Cover';
import ArticleCategoryEditForm from './ArticleCategoryEditForm';

// ----------------------------------------------------------------------

export default function ArticleCategoryEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { articleCategory } = useSelector((state) => state.articleCategory);

  useLayoutEffect(() => {
    dispatch(getArticleCategory(id));

    return () => {
      dispatch(resetArticleCategory());
    };
  
  }, [id, dispatch]);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={articleCategory?.name} isArchived={articleCategory?.isArchived} />
      </StyledCardContainer>
      <ArticleCategoryEditForm />
    </Container>
  );
}
