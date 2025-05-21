import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Card, Grid } from '@mui/material';
// redux
import {
  archiveDocumentType,
  deleteDocumentType,
  getActiveDocumentTypes,
  restoreDocumentType,
  setMergeDialogVisibility
} from '../../../../redux/slices/document/documentType';
// paths
import { PATH_MACHINE, PATH_SETTING } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import ViewFormAudit from '../../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';
import MergeDocumentTypeDialog from '../../../../components/Dialog/MergeDocumentTypeDialog';
import { handleError } from '../../../../utils/errorHandler';

// ----------------------------------------------------------------------

export default function DocumentTypeViewForm() {
  const { documentType, mergeDialogVisibility } = useSelector((state) => state.documentType);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      await dispatch(deleteDocumentType(documentType?._id));
      enqueueSnackbar('Document Type deleted Successfully!');
      navigate(PATH_MACHINE.documents.documentType.archived);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const onArchive = async () => {
    try {
      await dispatch(archiveDocumentType(documentType?._id));
      enqueueSnackbar('Document Type archived Successfully!');
      navigate(PATH_MACHINE.documents.documentType.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const onRestore = async () => {
    try {
      await dispatch(restoreDocumentType(documentType?._id));
      navigate(PATH_MACHINE.documents.documentType.list);
      enqueueSnackbar('Document Type restored Successfully!');
    } catch (error) {
      enqueueSnackbar('Document Type restored failed!', { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_MACHINE.documents.documentType.edit(documentType._id));
  };

  const handleMergeDialog = async () => {
    await dispatch(getActiveDocumentTypes());
    await dispatch(setMergeDialogVisibility(true));
  };

  const defaultValues = useMemo(
    () => ({
      isActive: documentType?.isActive,
      isDefault: documentType?.isDefault,
      isPrimaryDrawing: documentType?.isPrimaryDrawing,
      customerAccess: documentType?.customerAccess,
      name: documentType?.name,
      category: documentType?.docCategory?.name,
      description: documentType?.description || '',
      createdAt: documentType?.createdAt || '',
      createdByFullName: documentType?.createdBy?.name || '',
      createdIP: documentType?.createdIP || '',
      updatedAt: documentType?.updatedAt || '',
      updatedByFullName: documentType?.updatedBy?.name || '',
      updatedIP: documentType?.updatedIP || '',
      isArchived: documentType?.isArchived,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documentType]
  );

  return (
    <>
      <Card sx={{ p: 2 }}>
        <Grid>

          <ViewFormEditDeleteButtons
            customerAccess={defaultValues?.customerAccess}
            isDefault={defaultValues.isDefault}
            isActive={defaultValues.isActive}
            isPrimary={defaultValues.isPrimaryDrawing}
            handleEdit={handleEdit}
            {...(defaultValues?.isArchived ? { onDelete } : { onArchive })}
            {...(defaultValues?.isArchived && { onRestore })}
            backLink={() => navigate(PATH_MACHINE.documents.documentType.list)}
            settingPage
            onMergeDocumentType={handleMergeDialog}
          />
          <Grid container sx={{ mt: 2 }}>
            <ViewFormField sm={12} heading="Category" param={defaultValues.category} />
            <ViewFormField sm={6} heading="Type Name" param={defaultValues.name} />
            <ViewFormField sm={12} heading="Description" param={defaultValues.description} />
            <ViewFormAudit defaultValues={defaultValues} />
          </Grid>
        </Grid>
      </Card>
      {mergeDialogVisibility && <MergeDocumentTypeDialog />}
    </>
  );
}
