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

// ----------------------------------------------------------------------

export default function ArticleViewForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { article } = useSelector((state) => state.article);

  useLayoutEffect(() => {
    dispatch(getArticle(id));

    return () => {
      dispatch(resetArticle());
    };
  
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
      isActive: article?.isActive,
      serialNumber: article?.serialNumber,
      title: article?.title,
      description: article?.description || '',
      createdAt: article?.createdAt || '',
      createdByFullName: article?.createdBy?.name || '',
      createdIP: article?.createdIP || '',
      updatedAt: article?.updatedAt || '',
      updatedByFullName: article?.updatedBy?.name || '',
      updatedIP: article?.updatedIP || '',
      isArchived: article?.isArchived,
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
              isDefault={defaultValues.isDefault}
              isActive={defaultValues.isActive}
              isPrimary={defaultValues.isPrimaryDrawing}
              {...(!defaultValues?.isArchived && { handleEdit })}
              {...(defaultValues?.isArchived ? { onDelete } : { onArchive })}
              {...(defaultValues?.isArchived && { onRestore })}
              backLink={handlebackLink}
              settingPage
            />
            <Grid container sx={{ mt: 2 }}>
              <ViewFormField sm={6} heading="Title" param={defaultValues.title} />
              <ViewFormField sm={6} heading="Serial Number" param={defaultValues.serialNumber} />
              <ViewFormField sm={12} heading="Description" node={<div dangerouslySetInnerHTML={{ __html: defaultValues.description }} />} />
              <ViewFormAudit defaultValues={defaultValues} />
            </Grid>
          </Grid>
        </Card>
      </Container>
  );
}
