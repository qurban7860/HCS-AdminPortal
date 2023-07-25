import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Switch, Card, Grid, Stack, Typography, Button, Tooltip } from '@mui/material';
// redux
import { deleteDocumentCategory } from '../../../redux/slices/document/documentCategory';
// paths
import { PATH_DASHBOARD, PATH_DOCUMENT, PATH_SETTING } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import { fDate, fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormSWitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function DocumentCategoryViewForm() {
  const { documentCategory } = useSelector((state) => state.documentCategory);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      await dispatch(deleteDocumentCategory(documentCategory?._id));
      navigate(PATH_SETTING.documentCategory.list);
      enqueueSnackbar('Document Category delete Successfully!');
    } catch (error) {
      enqueueSnackbar('Document Category delete failed!', { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_SETTING.documentCategory.edit(documentCategory._id));
  };

  const defaultValues = useMemo(
    () => ({
      isActive: documentCategory?.isActive,
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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documentCategory]
  );
  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons handleEdit={handleEdit} onDelete={onDelete} />
        <Grid sm={12} display="flex">
          <Tooltip>
            <ViewFormField documentIsActive={defaultValues.isActive} />
          </Tooltip>
          <Tooltip>
            <ViewFormField customerAccess={defaultValues?.customerAccess} />
          </Tooltip>
        </Grid>
        <Grid container>
          <ViewFormField sm={12} heading="Category Name" param={defaultValues.name} />
          <ViewFormField sm={12} heading="Description" param={defaultValues.description} />
          <ViewFormField
            sm={12}
            heading="Document Types"
            arrayParam={defaultValues.documentTypes}
          />
          <ViewFormField />
          <ViewFormSWitch 
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
