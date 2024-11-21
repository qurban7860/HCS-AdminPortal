import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { Grid, Typography, Chip, TextField, Button } from '@mui/material';
import HistoryNotes from './HistoryNotes';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import CopyIcon from '../../../components/Icons/CopyIcon';
import { setContactDialog, getContact } from '../../../redux/slices/customer/contact';
import { fDateTime } from '../../../utils/formatTime';
import { useSnackbar } from '../../../components/snackbar';
import { addServiceReportNote, updateServiceReportNote, deleteServiceReportNote } from '../../../redux/slices/products/machineServiceReport';

const ViewHistory = ({ name, label, historicalData, title, methods }) => {

  const dispatch = useDispatch()
  const method = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading, isLoadingReportNote } = useSelector((state) => state.machineServiceReport);
  const { id } = useParams();
  const {
    getValues,
    setValue,
    formState: { isSubmitting },
  } = methods || method;

  const currentData = ( Array.isArray(historicalData) && historicalData?.length > 0 ) && historicalData[0] || null;
  const hasTechnician = Boolean(currentData?.technician);
  const hasOperators = Array.isArray(currentData?.operators) && currentData?.operators.length > 0;
  const filteredHistoricalData = Array.isArray(historicalData) && historicalData?.slice(1) || [];
  const [ val, setVal ] = useState("");
  const [ isEditing, setIsEditing ] = useState(false);
  
  const handleContactDialog = useCallback( async ( customerId, contactId ) => {
    await dispatch( getContact( customerId, contactId ) )
    await dispatch( setContactDialog( true ) )
  },[ dispatch ])

  const onDelete = async ( ) => {
    try{
      await dispatch( deleteServiceReportNote( currentData?.serviceReport?._id, currentData?._id, currentData?.type ) )
      enqueueSnackbar("Note deleted successfully!");
    } catch (error){
      enqueueSnackbar(error?.message || "note delete failed!", { variant: `error` });
    }
  }

  const handleSave = async (data) => {
    try{
      if( currentData?._id && isEditing ){
        await dispatch(updateServiceReportNote( id, currentData?._id, currentData?.type, val ))
        enqueueSnackbar("Note updated successfully!");
        setVal("")
        setIsEditing(false);
      } else{
        const currentValue = getValues(name);
        await dispatch(addServiceReportNote( id, name, currentValue ))
        setVal("")
        setValue(name,"");
        enqueueSnackbar("Note saved successfully!");
      }
    } catch (error){
      enqueueSnackbar(error?.message || "Note save failed!", { variant: `error` });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setVal(currentData?.note || "");
    if(name){
      setValue(name, currentData?.note || "");
    }
  };

  const handleChangeValue = async (event) => {
    setVal(event.target.value)
    if( name && !isEditing ){
      setValue(name, event.target.value)
    } 
  }

  const handleCancel = () => {
    setVal("");
    setIsEditing(false);
  };

  return (
    <Grid container >
        { (isEditing || name ) &&
          <>
            <TextField 
              size='small'
              fullWidth
              multiline
              minRows={3}
              name={name}
              label={label}
              value={val}
              onChange={ handleChangeValue }
              sx={{ mb: 1 }}
            />
            <Grid container display='flex' direction='row' justifyContent='flex-end' gap={ 2 }>
              { isEditing && <Button size='small' variant='outlined' onClick={ handleCancel } disabled={ isLoading || isLoadingReportNote || isSubmitting } >cancel</Button>}
              <LoadingButton disabled={ isLoading || isLoadingReportNote || isSubmitting } onClick={ handleSave } loading={ isLoadingReportNote } size='small' variant='contained'>{ isEditing ? "Update" : "Save" }</LoadingButton>
            </Grid>
          </>
        }
      <Grid container item md={12} sx={{ px: 0.5, pt: 1, display:"block", alignItems: 'center', whiteSpace: 'pre-line', overflowWrap: 'break-word'  }}>
        { !isEditing &&
          <Typography variant="body2" sx={{color: 'text.disabled', }}>
            <Typography variant="overline" sx={{color: 'text.disabled', display: "flex", justifyContent: "space-between", alignItems: 'center', whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>{`${title || "Notes"}:`}
              <Grid sx={{ position: "relative", mb: -2 }} >
                <ViewFormEditDeleteButtons 
                  onDelete={onDelete}
                  handleEdit={handleEdit}
                />
              </Grid>
            </Typography>
            {currentData?.note || ""}{ currentData?.note?.trim() && <CopyIcon value={currentData?.note}/> }
          </Typography>
        }
        <Typography variant="body2" sx={{ px: 0.5, color: 'text.disabled', alignItems: "center", display: "flex", width:"100%" }}>
          <>
            {hasTechnician && (
              <>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                  <b>Technician:</b>
                </Typography>
                <Chip 
                  sx={{ m: 0.5 }}
                  label={`${currentData?.technician?.firstName || ''} ${currentData?.technician?.lastName || ''}`}
                  onClick={() => handleContactDialog(currentData?.technician?.customer?._id, currentData?.technician?._id)}
                />
              </>
            )}
            {hasOperators && (
              <>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                  <b>Operators:</b>
                </Typography>
                {currentData?.operators?.map(op => (
                  <Chip
                    key={op._id}
                    sx={{ m: 0.5 }}
                    label={`${op.firstName || ''} ${op.lastName || ''}`}
                    onClick={() => handleContactDialog(op.customer?._id, op._id)}
                  />
                ))}
              </>
            )}
            {currentData?.updatedBy && 
              <Typography variant="overline" sx={{ color: 'text.disabled', ml:"auto"  }}>
                <i><b>Last Modified: </b>{fDateTime(currentData?.createdAt)}{` by `}{`${ currentData?.updatedBy?.name || ''}`}</i>
              </Typography>
            }
          </>
        </Typography>
      </Grid>
      { Array.isArray(filteredHistoricalData) && filteredHistoricalData?.length > 0 && 
        <HistoryNotes title={title} historicalData={filteredHistoricalData} />
      }
    </Grid>
  );
};

ViewHistory.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  title: PropTypes.string,
  historicalData: PropTypes.array,
  methods: PropTypes.any
};

export default ViewHistory;
