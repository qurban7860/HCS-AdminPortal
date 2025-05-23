import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// @mui
import { Card, Container, Grid } from '@mui/material';
// redux
import {
  archiveArticleCategory,
  deleteArticleCategory,
  getArticleCategory,
  restoreArticleCategory,
  resetArticleCategory
} from '../../../../redux/slices/support/supportSettings/articleCategory';
// paths
import { PATH_SUPPORT } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import ViewFormAudit from '../../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';
import { handleError } from '../../../../utils/errorHandler';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function ArticleCategoryViewForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { articleCategory, isLoading } = useSelector((state) => state.articleCategory);

  const onDelete = async () => {
    try {
      await dispatch(deleteArticleCategory(articleCategory?._id));
      enqueueSnackbar('Article Category deleted successfully!');
      navigate(PATH_SUPPORT.supportSettings.articleCategories.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const onArchive = async () => {
    try {
      await dispatch(archiveArticleCategory(articleCategory?._id));
      enqueueSnackbar('Article Category archived successfully!');
      navigate(PATH_SUPPORT.supportSettings.articleCategories.archived);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const onRestore = async () => {
    try {
      await dispatch(restoreArticleCategory(articleCategory?._id));
      navigate(PATH_SUPPORT.supportSettings.articleCategories.root);
      enqueueSnackbar('Article Category restored successfully!');
    } catch (error) {
      enqueueSnackbar('Article Category restored failed!', { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_SUPPORT.supportSettings.articleCategories.edit(articleCategory._id));
  };

  const defaultValues = useMemo(
    () => ({
      name: articleCategory?.name || '',
      description: articleCategory?.description || '',
      isActive: articleCategory?.isActive,
      createdAt: articleCategory?.createdAt || '',
      createdByFullName: articleCategory?.createdBy?.name || '',
      createdIP: articleCategory?.createdIP || '',
      updatedAt: articleCategory?.updatedAt || '',
      updatedByFullName: articleCategory?.updatedBy?.name || '',
      updatedIP: articleCategory?.updatedIP || '',
      isArchived: articleCategory?.isArchived,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [articleCategory]
  );

  const handlebackLink = () => {
    if(defaultValues.isArchived){
      navigate(PATH_SUPPORT.supportSettings.articleCategories.archived);
    }else{
      navigate(PATH_SUPPORT.supportSettings.articleCategories.root);
    }
  };

  return (
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
              <ViewFormField isLoading={isLoading} sm={12} heading="Name" param={defaultValues.name} />
              <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues.description} />
              <ViewFormAudit defaultValues={defaultValues} />
            </Grid>
          </Grid>
        </Card>
  );
}
