import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Switch, Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { setCustomerDocumentEditFormVisibility , deleteCustomerDocument , getCustomerDocuments , getCustomerDocument} from '../../../redux/slices/document/customerDocument';
// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { fDate,fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormField from '../../components/ViewFormField';
import ViewFormSWitch from '../../components/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------
DocumentViewForm.propTypes = {
  currentCustomerDocument: PropTypes.object,
};

export default function DocumentViewForm({ currentCustomerDocument = null }) {
  const { customerDocument } = useSelector((state) => state.customerDocument);

  const navigate = useNavigate();

  const dispatch = useDispatch(); 

  const onDelete = async () => {
    await dispatch(deleteCustomerDocument(customerDocument._id));
    dispatch(getCustomerDocument(customerDocument._id));
  };

  const  handleEdit = async () => {
    await dispatch(getCustomerDocument(customerDocument._id));
    dispatch(setCustomerDocumentEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => (
      {
        isActive:                 currentCustomerDocument?.isActive,
        createdAt:                currentCustomerDocument?.createdAt || "",
        createdByFullName:        currentCustomerDocument?.createdBy?.name || "",
        createdIP:                currentCustomerDocument?.createdIP || "",
        updatedAt:                currentCustomerDocument?.updatedAt || "",
        updatedByFullName:        currentCustomerDocument?.updatedBy?.name || "",
        updatedIP:                currentCustomerDocument?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCustomerDocument, customerDocument]
  );

  return (
    <Grid >
      <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/>
      <Grid container>
          <ViewFormField sm={6} heading="Name" param="Category Name" />
          <ViewFormSWitch isActive={defaultValues.isActive}/>
          <ViewFormAudit defaultValues={defaultValues}/>
      </Grid>
    </Grid>
  );
}
