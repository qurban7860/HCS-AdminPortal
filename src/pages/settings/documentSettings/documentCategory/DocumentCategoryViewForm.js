// import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Card, Chip, Grid } from '@mui/material';
// redux
import { deleteDocumentCategory, archiveDocumentCategory, restoreDocumentCategory } from '../../../../redux/slices/document/documentCategory';
// paths
import { PATH_MACHINE, PATH_SETTING } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import ViewFormAudit from '../../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import ViewFormSWitch from '../../../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';
import Iconify from '../../../../components/iconify';
import { handleError } from '../../../../utils/errorHandler';

// ----------------------------------------------------------------------

export default function DocumentCategoryViewForm() {
  const { documentCategory, isLoading } = useSelector((state) => state.documentCategory);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      await dispatch(deleteDocumentCategory(documentCategory?._id));
      enqueueSnackbar('Document Category deleted Successfully!');
      navigate(PATH_MACHINE.documents.documentCategory.archived);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const onArchive = async () => {
    try {
      await dispatch(archiveDocumentCategory(documentCategory?._id));
      enqueueSnackbar('Document Category archived Successfully!');
      navigate(PATH_MACHINE.documents.documentCategory.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const onRestore = async () => {
    try {
      await dispatch(restoreDocumentCategory(documentCategory?._id));
      enqueueSnackbar('Document Category restored Successfully!');
      navigate(PATH_MACHINE.documents.documentCategory.list);
    } catch (error) {
      enqueueSnackbar('Failed!', { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_MACHINE.documents.documentCategory.edit(documentCategory._id));
  };

  const defaultValues = useMemo(
    () => ({
      isActive: documentCategory?.isActive,
      isDefault: documentCategory?.isDefault,
      customerAccess: documentCategory?.customerAccess,
      name: documentCategory?.name,
      documentTypes: documentCategory?.documentTypes || [],
      description: documentCategory?.description || '',
      createdAt: documentCategory?.createdAt || '',
      createdByFullName: documentCategory?.createdBy?.name || '',
      createdIP: documentCategory?.createdIP || '',
      updatedAt: documentCategory?.updatedAt || '',
      updatedByFullName: documentCategory?.updatedBy?.name || '',
      updatedIP: documentCategory?.updatedIP || '',
      isArchived: documentCategory?.isArchived,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documentCategory]
  );

  const handleViewDocumentType = (documentTypeId, newTab = false) => {
    if(newTab){
      window.open(PATH_MACHINE.documents.documentType.view(documentTypeId), '_blank');
    }else{
      navigate(PATH_MACHINE.documents.documentType.view(documentTypeId));
    }
  };

  const linkedDocumentTypes = documentCategory?.documentTypes?.map((documentType, index) => (
      <Chip 
        sx={{ml:index===0?0:1, my:0.2}} 
        onClick={() => handleViewDocumentType(documentType._id)} 
        deleteIcon={<Iconify icon="fluent:open-12-regular"/>}
        onDelete={()=> handleViewDocumentType(documentType._id, true)}
        label={`${documentType?.name || ''} `} 
      />
  ));

  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons 
          customerAccess={defaultValues?.customerAccess} 
          isDefault={defaultValues.isDefault} 
          isActive={defaultValues.isActive} 
          handleEdit={handleEdit}
          {...(defaultValues?.isArchived && { onRestore })}
          {...(defaultValues?.isArchived ? { onDelete } : { onArchive })}
          backLink={() => navigate(PATH_MACHINE.documents.documentCategory.list)}
          settingPage
        />
        <Grid container sx={{mt:2}}>
          <ViewFormField isLoading={isLoading} sm={12} heading="Category Name" param={defaultValues.name} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues.description} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Document Types" chipDialogArrayParam={linkedDocumentTypes} />
          <ViewFormSWitch isLoading={isLoading}
              customerHeading='Customer' 
              customer={documentCategory?.customer} 
              machineHeading='Machine' 
              machine={documentCategory?.machine} 
              drawingHeading='Drawing' 
              drawing={documentCategory?.drawing}
                sx={{mt:2}}
              />

          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}
