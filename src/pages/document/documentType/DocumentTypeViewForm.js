import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Switch, Card, Grid, Stack, Typography, Button ,Tooltip} from '@mui/material';
// redux
import {  setDocumentTypeEditFormVisibility , deleteDocumentType , getDocumentTypes , getDocumentType } from '../../../redux/slices/document/documentType';
// paths
import { PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import { fDate,fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormField from '../../components/ViewFormField';
import ViewFormSWitch from '../../components/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------
DocumentTypeViewForm.propTypes = {
  currentDocumentType: PropTypes.object,
};

export default function DocumentTypeViewForm({ currentDocumentType = null }) {
  const { documentType } = useSelector((state) => state.documentType);
// console.log("documentType : ",documentType)
  const navigate = useNavigate();

  const dispatch = useDispatch(); 
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try{
      await dispatch(deleteDocumentType(documentType?._id));
      navigate(PATH_DOCUMENT.documentType.list);
      enqueueSnackbar('Document Type delete Successfully!');

    }catch(error){
      enqueueSnackbar('Document Type delete failed!');
      console.error(error);
    }
  };

  const  handleEdit = async () => {
    navigate(PATH_DOCUMENT.documentType.edit(documentType._id))
  };

  const defaultValues = useMemo(
    () => (
      {
        isActive:                 currentDocumentType?.isActive,
        customerAccess:           currentDocumentType?.customerAccess,
        name:                     currentDocumentType?.name,
        description:              currentDocumentType?.description || "",
        createdAt:                currentDocumentType?.createdAt || "",
        createdByFullName:        currentDocumentType?.createdBy?.name || "",
        createdIP:                currentDocumentType?.createdIP || "",
        updatedAt:                currentDocumentType?.updatedAt || "",
        updatedByFullName:        currentDocumentType?.updatedBy?.name || "",
        updatedIP:                currentDocumentType?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocumentType, documentType]
  );

  return (
    <Card sx={{p:2}}>
      <Grid >
        <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/>
        <Grid container>
        <Grid sm={12} display="flex">
              <Tooltip xs={6} sm={1.5} md={0.5} lg={0.3}>
                <ViewFormField  documentIsActive={defaultValues.isActive}  />
              </Tooltip>
              <Tooltip xs={6} sm={1.5} md={0.5} lg={0.3}>
                <ViewFormField  customerAccess={defaultValues?.customerAccess} />
              </Tooltip>
            </Grid>
            <ViewFormField sm={6} heading="Name" param={defaultValues.name} />
            <ViewFormField sm={12} heading="Description" param={defaultValues.description} />
            {/* <ViewFormSWitch heading="isActive" disabled isActive={defaultValues.isActive}/> */}
            <ViewFormAudit  defaultValues={defaultValues}/>
        </Grid>
      </Grid>
    </Card>
  );
}
