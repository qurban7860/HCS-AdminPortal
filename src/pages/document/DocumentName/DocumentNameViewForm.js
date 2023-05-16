import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Switch, Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { setDocumentNameFormVisibility , setDocumentNameEditFormVisibility , deleteDocumentName , getDocumentNames , getDocumentName } from '../../../redux/slices/document/documentName';
// paths
import { PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
// components
import { fDate,fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormField from '../../components/ViewFormField';
import ViewFormSWitch from '../../components/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------
DocumentNameViewForm.propTypes = {
  currentDocumentName: PropTypes.object,
};

export default function DocumentNameViewForm({ currentDocumentName = null }) {
  const { documentName } = useSelector((state) => state.documentName);

  const navigate = useNavigate();

  const dispatch = useDispatch(); 

  const onDelete = async () => {
    await dispatch(deleteDocumentName(documentName._id));
    dispatch(getDocumentNames());
  };

  const  handleEdit = async () => {
    await dispatch(getDocumentName(documentName._id));
    dispatch(setDocumentNameEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => (
      {
        isActive:                 currentDocumentName?.isActive,
        createdAt:                currentDocumentName?.createdAt || "",
        createdByFullName:        currentDocumentName?.createdBy?.name || "",
        createdIP:                currentDocumentName?.createdIP || "",
        updatedAt:                currentDocumentName?.updatedAt || "",
        updatedByFullName:        currentDocumentName?.updatedBy?.name || "",
        updatedIP:                currentDocumentName?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocumentName, documentName]
  );

  return (
    <Card sx={{p:2,mx:2}}>
      <Grid >
        <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/>
        <Grid container>
            <ViewFormField sm={6} heading="Name" param="Name ..." />
            <ViewFormField sm={12} heading="Description" param="Description ..." />
            <ViewFormSWitch isActive={defaultValues.isActive}/>
            <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>
      </Grid>
    </Card>
  );
}
