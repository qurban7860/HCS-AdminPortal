import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// @mui
import { Card, Container, Grid } from '@mui/material';
// redux
import {
  archiveArticle,
  deleteArticle,
  getArticle,
  restoreArticle,
  resetArticle
} from '../../../../redux/slices/support/knowledgeBase/article';
// paths
import { PATH_SUPPORT } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import ViewFormAudit from '../../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';
import { handleError } from '../../../../utils/errorHandler';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { Cover } from '../../../../components/Defaults/Cover';
import LoadingScreen from '../../../../components/loading-screen';

// ----------------------------------------------------------------------

export default function ArticleViewForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { article, isLoading } = useSelector((state) => state.article);
  const prefix = JSON.parse(localStorage.getItem('configurations'))?.find((config) => config?.name?.toLowerCase() === 'article_prefix')?.value?.trim() || ''; 

  useLayoutEffect(() => {
    dispatch(getArticle(id));
  }, [id, dispatch]);

  const onDelete = async () => {
    try {
      await dispatch(deleteArticle(article?._id));
      enqueueSnackbar('Knowledge Base deleted successfully!');
      navigate(PATH_SUPPORT.knowledgeBase.article.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const onArchive = async () => {
    try {
      await dispatch(archiveArticle(article?._id));
      enqueueSnackbar('Knowledge Base archived successfully!');
      navigate(PATH_SUPPORT.knowledgeBase.article.view(article._id));
    } catch (error) {
      console.error(error);
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const onRestore = async () => {
    try {
      await dispatch(restoreArticle(article?._id));
      navigate(PATH_SUPPORT.knowledgeBase.article.view(article._id));
      enqueueSnackbar('Knowledge Base restored successfully!');
    } catch (error) {
      enqueueSnackbar('Knowledge Base restored failed!', { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_SUPPORT.knowledgeBase.article.edit(article._id));
  };

  const defaultValues = useMemo(
    () => ({
      articleNo: `${prefix}-${article?.articleNo}`,
      title: article?.title,
      description: article?.description || '',
      category: article?.category,
      status: article?.status,
      customerAccess: article?.customerAccess,
      isActive: article?.isActive,
      isArchived: article?.isArchived,
      createdAt: article?.createdAt || '',
      createdByFullName: article?.createdBy?.name || '',
      createdIP: article?.createdIP || '',
      updatedAt: article?.updatedAt || '',
      updatedByFullName: article?.updatedBy?.name || '',
      updatedIP: article?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [article]
  );

  const handlebackLink = () => {
    if(defaultValues.isArchived){
      navigate(PATH_SUPPORT.knowledgeBase.article.archived);
    }else{
      navigate(PATH_SUPPORT.knowledgeBase.article.root);
    }
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={article?.title} isArchived={defaultValues.isArchived} />
      </StyledCardContainer>
      <Card sx={{ p: 2 }}>
        <Grid>
          <ViewFormEditDeleteButtons
              customerAccess={defaultValues?.customerAccess}
              isActive={defaultValues.isActive}
              {...(!defaultValues?.isArchived && { handleEdit })}
              {...(defaultValues?.isArchived ? { onDelete } : { onArchive })}
              {...(defaultValues?.isArchived && { onRestore })}
              backLink={handlebackLink}
              settingPage
            />
            <Grid container sx={{ mt: 2 }}>
              <ViewFormField isLoading={isLoading} sm={4} heading="Category" param={defaultValues.category?.name || ''} />
              <ViewFormField isLoading={isLoading} sm={4} heading="Article No" param={defaultValues.articleNo || ''} />
              <ViewFormField isLoading={isLoading} sm={4} heading="Status" param={defaultValues.status || ''} />
              <ViewFormField isLoading={isLoading} sm={6} heading="Title" param={defaultValues.title || ''} />
              <ViewFormField isLoading={isLoading} sm={12} 
                heading="Description" 
                node={
                  <div dangerouslySetInnerHTML={{ __html: 
                    `<style>ul { padding-left: 40px;}</style>${defaultValues.description || ''}` 
                  }} />
                } 
              />
              <ViewFormAudit defaultValues={defaultValues} />
            </Grid>
          </Grid>
        </Card>
      </Container>
  );
}
