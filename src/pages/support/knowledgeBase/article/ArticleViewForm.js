import { useLayoutEffect, useMemo, useState } from 'react';
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
  resetArticle,
  updateArticleStatus
} from '../../../../redux/slices/support/knowledgeBase/article';
// paths
import { PATH_SUPPORT } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import ViewFormAudit from '../../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormSelect from '../../../../components/ViewForms/ViewFormSelect';
import { handleError } from '../../../../utils/errorHandler';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { Cover } from '../../../../components/Defaults/Cover';
import LoadingScreen from '../../../../components/loading-screen';
import { articleStatusOptions } from '../../../../utils/constants';
import Editor from '../../../../components/editor';

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
      if(article?.isArchived){
        navigate(PATH_SUPPORT.knowledgeBase.article.archived);
      }else{
        navigate(PATH_SUPPORT.knowledgeBase.article.root);
      }
      enqueueSnackbar('Article deleted successfully!', { variant: `success` });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const onArchive = async () => {
    try {
      await dispatch(archiveArticle(article?._id));
      navigate(PATH_SUPPORT.knowledgeBase.article.archived);
      enqueueSnackbar('Article archived successfully!', { variant: `success` });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const onRestore = async () => {
    try {
      await dispatch(restoreArticle(article?._id));
      navigate(PATH_SUPPORT.knowledgeBase.article.root);
      enqueueSnackbar('Article restored successfully!', { variant: `success` });
    } catch (error) {
      enqueueSnackbar('Article restored failed!', { variant: `error` });
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

  const handleStatusChange = async (e) => {
    try {
      await dispatch(updateArticleStatus(article._id, {status: e.target.value}));
      enqueueSnackbar('Article status updated successfully!', { variant: `success` });
    } catch (error) {
      enqueueSnackbar(handleError(error), { variant: `error` });
      console.error(error);
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
              <ViewFormField isLoading={isLoading} sm={4} heading="Status"
                node={<ViewFormSelect sx={{ width: '150px' }} options={articleStatusOptions} value={defaultValues.status} onChange={handleStatusChange} /> }
              />
              <ViewFormField isLoading={isLoading} sm={12} heading="Title" param={defaultValues.title || ''} />
              <ViewFormField isLoading={isLoading} sm={12} 
                heading="Description" 
                node={<Editor readOnly hideToolbar sx={{ border: 'none', '& .ql-editor': { padding: '0px' } }} value={defaultValues.description} />}
              />
              <ViewFormAudit defaultValues={defaultValues} />
            </Grid>
          </Grid>
        </Card>
      </Container>
  );
}
