// import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import {  Card, Grid } from '@mui/material';
// redux
import { 
  deleteDocumentType,
} from '../../../redux/slices/document/documentType';
// paths
import {  PATH_SETTING } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// import { fDate, fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function DocumentTypeViewForm() {
  const { documentType } = useSelector((state) => state.documentType);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      await dispatch(deleteDocumentType(documentType?._id));
      navigate(PATH_SETTING.documentType.list);
      enqueueSnackbar('Document Type delete Successfully!');
    } catch (error) {
      enqueueSnackbar('Document Type delete failed!', { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_SETTING.documentType.edit(documentType._id));
  };

  const defaultValues = useMemo(
    () => ({
      isActive: documentType?.isActive,
      isDefault: documentType?.isDefault,
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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documentType]
  );

  return (
    <Card sx={{ p: 2 }}>
      <Grid>
          
        <ViewFormEditDeleteButtons customerAccess={defaultValues?.customerAccess} isDefault={defaultValues.isDefault} isActive={defaultValues.isActive} handleEdit={handleEdit} onDelete={onDelete} backLink={() => navigate(PATH_SETTING.documentType.list)}/>
        <Grid container sx={{mt:2}}>
          <ViewFormField sm={12} heading="Category" param={defaultValues.category} />
          <ViewFormField sm={6} heading="Type Name" param={defaultValues.name} />
          <ViewFormField sm={12} heading="Description" param={defaultValues.description} />
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}
