import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import Image from 'mui-image';
// eslint-disable-next-line import/no-anonymous-default-export
import { Switch, Card, Grid, Stack, Typography, Button , Box} from '@mui/material';
// redux
import { setMachineDocumentEditFormVisibility , deleteMachineDocument , getMachineDocuments , getMachineDocument, updateMachineDocument} from '../../../redux/slices/document/machineDocument';
// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { fDate,fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormField from '../../components/ViewFormField';
import ViewFormSWitch from '../../components/ViewFormSwitch'
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
    <Grid sx={{mt:-2}}>
      <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/>
        <Grid container >
          <ViewFormField sm={12} isActive={defaultValues.isActive} />
          <ViewFormField sm={6} heading="Name" param={defaultValues?.name} />
          <ViewFormField sm={6} heading="Document Name" param={defaultValues?.documentName} />
          <ViewFormField sm={6} heading="Category" param={defaultValues?.category} />
          <ViewFormField sm={6} heading="Customer" param={defaultValues?.customer} />
          <ViewFormField sm={6} heading="Version" numberParam={defaultValues?.documentVersion} />
          <Grid item xs={12} sm={6} sx={{px:2,py:1, overflowWrap: "break-word",}}>
            <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
            Customer Access
            </Typography>
            <Typography>
              <Switch  checked={defaultValues?.customerAccess}  disabled/>
            </Typography>
          </Grid>
          {/* <ViewFormField sm={6} heading="Customer Access" param={defaultValues?.customerAccess === true ? "Yes" : "No"} /> */}
          <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />

          {currentMachineDocument?.type.startsWith("image")  && currentMachineDocument?.customerAccess === true ?
          <Image alt={defaultValues.name} src={currentMachineDocument?.path} /> : null}

          {/* <ViewFormSWitch isActive={defaultValues.isActive}/> */}
          <Grid container sx={{ mt: '1rem' }}>
              <ViewFormAudit defaultValues={defaultValues}/>
          </Grid>
        </Grid>
    </Grid>
  );
}
