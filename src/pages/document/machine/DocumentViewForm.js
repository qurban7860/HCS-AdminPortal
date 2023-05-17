import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Switch, Card, Grid, Stack, Typography, Button , Box} from '@mui/material';
// redux
import { setMachineDocumentEditFormVisibility , deleteMachineDocument , getMachineDocuments , getMachineDocument, updateMachineDocument} from '../../../redux/slices/document/machineDocument';
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
  currentMachineDocument: PropTypes.object,
};

export default function DocumentViewForm({ currentMachineDocument = null }) {
  const { machineDocument } = useSelector((state) => state.machineDocument);
  const { machine , machines } = useSelector((state) => state.machine);

// console.log(machineDocument)
// console.log("currentMachineDocument", currentMachineDocument)
  const navigate = useNavigate();

  const dispatch = useDispatch(); 

  const onDelete = async () => {
    await dispatch(deleteMachineDocument(currentMachineDocument._id));
    await dispatch(getMachineDocuments(machine._id));
  };

  const  handleEdit = async () => {
    await dispatch(getMachineDocument(currentMachineDocument._id));
    // console.log("machineDocument : ",machineDocument)
    dispatch(setMachineDocumentEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => (
      {
        name:                     currentMachineDocument?.name || "",
        documentName:             currentMachineDocument?.documentName?.name || "",
        category:                 currentMachineDocument?.category?.name || "",
        customer:                 currentMachineDocument?.customer?.name,
        customerAccess:           currentMachineDocument?.customerAccess,
        documentVersion:          currentMachineDocument?.documentVersion,
        description:              currentMachineDocument?.description,
        isActive:                 currentMachineDocument?.isActive,
        createdAt:                currentMachineDocument?.createdAt || "",
        createdByFullName:        currentMachineDocument?.createdBy?.name || "",
        createdIP:                currentMachineDocument?.createdIP || "",
        updatedAt:                currentMachineDocument?.updatedAt || "",
        updatedByFullName:        currentMachineDocument?.updatedBy?.name || "",
        updatedIP:                currentMachineDocument?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentMachineDocument]
  );

  return (
    <Grid >
      <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/>
        <Grid container>
          <ViewFormField sm={6} heading="Name" param={defaultValues?.name} />
          <ViewFormField sm={6} heading="Document Name" param={defaultValues?.documentName} />
          <ViewFormField sm={6} heading="Category" param={defaultValues?.category} />
          <ViewFormField sm={6} heading="Customer" param={defaultValues?.customer} />
          <ViewFormField sm={6} heading="Version" numberParam={defaultValues?.documentVersion} />
          <ViewFormField sm={6} heading="Customer Access" param={defaultValues?.customerAccess === true ? "Yes" : "No"} />
          <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
          {currentMachineDocument?.type.startsWith("image")  && currentMachineDocument?.customerAccess === true ? 
          <Box
        component="img"
        sx={{
          m:2,
          height: 233,
          width: 350,
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
        }}
        alt={defaultValues?.name}
        src={currentMachineDocument?.path}
      />:""}
          <ViewFormSWitch isActive={defaultValues.isActive}/>
          <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>
    </Grid>
  );
}
