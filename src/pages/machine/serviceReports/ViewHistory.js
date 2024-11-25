import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { Grid, Typography, Chip, TextField, Button } from '@mui/material';
import HistoryNotes from './HistoryNotes';
import ServiceReportAuditLogs from './ServiceReportAuditLogs';
import CopyIcon from '../../../components/Icons/CopyIcon';
import IconifyButton from '../../../components/Icons/IconifyButton';
import { setContactDialog, getContact } from '../../../redux/slices/customer/contact';
import { useSnackbar } from '../../../components/snackbar';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { addServiceReportNote, updateServiceReportNote, deleteServiceReportNote } from '../../../redux/slices/products/machineServiceReport';

const ViewHistory = ({ name, label, historicalData, methods }) => {

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

  const [ val, setVal ] = useState("");
  const [ isEditing, setIsEditing ] = useState(false);
  const [ currentData, setCurrentData ] = useState(null);
  const [ loading, setLoading ] = useState(null);
  const [ hasTechnician, setHasTechnician ] = useState({});
  const [ hasOperators, setHasOperators ] = useState([]);
  const [ filteredHistoricalData, setFilteredHistoricalData ] = useState([]);

  useEffect(()=>{
    const Data = ( Array.isArray(historicalData) && historicalData?.length > 0 ) && historicalData[0] || null;
    setCurrentData( Data );
    setHasTechnician( Boolean(Data?.technician) );
    setHasOperators( Array.isArray(Data?.operators) && Data?.operators.length > 0 );
    setFilteredHistoricalData( Array.isArray(historicalData) && historicalData?.slice(1) || [] );
  },[ historicalData ])

  const handleContactDialog = useCallback( async ( customerId, contactId ) => {
    await dispatch( getContact( customerId, contactId ) )
    await dispatch( setContactDialog( true ) )
  },[ dispatch ])

  const onDelete = async ( ) => {
    try{
      setLoading(true);
      await dispatch( deleteServiceReportNote( currentData?.serviceReport?._id, currentData?._id, currentData?.type ) )
      enqueueSnackbar("Note deleted successfully!");
      setLoading(false);
    } catch (error){
      setLoading(false);
      enqueueSnackbar(error?.message || "note delete failed!", { variant: `error` });
    }
  }

  const handleSave = async () => {
    try{
      const data = {
        name: currentData?.type || name || ""
      }

      if( currentData?.type === "technicianNotes" ){
        data.technician = methods ? getValues("technician") : currentData?.technician;
      }

      if( currentData?.type === "operatorNotes" ){
        data.operators = methods ? getValues("operators") : currentData?.operators;
      }
      setLoading(true);
      if( currentData?._id && isEditing ){
        data.note = val;
        await dispatch(updateServiceReportNote( id, currentData?._id, currentData?.type, data ))
        enqueueSnackbar("Note updated successfully!");
        setVal("")
        setIsEditing(false);
      } else if( id ){
        data.note = getValues(name);
        await dispatch(addServiceReportNote( id, name, data ))
        setVal("")
        setValue(name,"");
        enqueueSnackbar("Note saved successfully!");
      }
      setLoading(false);
    } catch (error){
      setLoading(false);
      enqueueSnackbar(error?.message || "Note save failed!", { variant: `error` });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setVal(currentData?.note || "");
    if(name){
      
      if( currentData?.type === "technicianNotes" && currentData?.technician ){
        setValue("technician",currentData?.technician);
      }

      if( currentData?.type === "operatorNotes" && currentData?.operators ){
        setValue("operators",currentData?.operators);
      }

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
    <Grid container sx={{ mb: 1}}>
        { (isEditing || name ) &&
          <>
            <TextField 
              size='small'
              fullWidth
              multiline
              minRows={3}
              name={name}
              label={ label || currentData?.type || "Notes"}
              value={val}
              onChange={ handleChangeValue }
              sx={{ mb: 1, mt: methods ? 0 : 2 }}
            />
            { id && 
              <Grid container display='flex' direction='row' justifyContent='flex-end' gap={ 2 }>
                { isEditing && <Button size='small' variant='outlined' onClick={ handleCancel } disabled={ loading } >cancel</Button>}
                <LoadingButton disabled={ isLoading || loading || isSubmitting } onClick={ handleSave } loading={ isLoadingReportNote } size='small' variant='contained'>{ isEditing ? "Update" : "Save" }</LoadingButton>
              </Grid>
            }
          </>
        }
      { id && !isEditing &&
      <Grid container item md={12} sx={{ pt: 1, display:"block", alignItems: 'center', whiteSpace: 'pre-line', overflowWrap: 'break-word'  }}>
        { !isEditing && currentData?.note && currentData?.note?.trim() &&
          <Typography variant="body2" sx={{color: 'text.disabled', }}>
            <FormLabel content={`${ label || currentData?.type || "Notes"}:`} />
            {/* <Typography variant="overline" 
              sx={{ pb: currentData?.note?.trim() ? 0 : 3,
                    color: 'text.disabled', 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: 'center', 
                    whiteSpace: 'pre-line', 
                    overflowWrap: 'break-word' 
                }}
              >{`${ label || currentData?.type || "Notes"}:`}
            </Typography> */}
            {currentData?.note || ""}
            { currentData?.note?.trim() && <CopyIcon value={currentData?.note}/> }
            { methods &&
              <>
                <IconifyButton 
                  title='Edit'
                  icon='mdi:edit'
                  color='#103996'
                  onClick={handleEdit}
                />
                <IconifyButton 
                  title='Delete'
                  icon='mdi:delete'
                  color='#FF0000'
                  onClick={ onDelete }
                />
              </>
            }
          </Typography>
        }
        <Typography variant="body2" sx={{ color: 'text.disabled', alignItems: "center", display: "flex", width:"100%" }}>
          <>
            {hasTechnician && (
              <>
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                  <b>Technician:</b>
                </Typography>
                {currentData?.technician?.firstName && <Chip 
                  sx={{ m: 0.5 }}
                  label={`${currentData?.technician?.firstName || ''} ${currentData?.technician?.lastName || ''}`}
                  onClick={() => handleContactDialog(currentData?.technician?.customer?._id, currentData?.technician?._id)}
                />}
              </>
            )}
            {hasOperators && (
              <>
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                  <b>Operators:</b>
                </Typography>
                {currentData?.operators?.map(op => (
                  op?.firstName && <Chip
                    key={op._id}
                    sx={{ m: 0.5 }}
                    label={`${op.firstName || ''} ${op.lastName || ''}`}
                    onClick={() => handleContactDialog(op.customer?._id, op._id)}
                  />
                ))}
              </>
            )}
          </>
        </Typography>
            <ServiceReportAuditLogs data={ currentData || null } />
      </Grid>}
      { Array.isArray(filteredHistoricalData) && filteredHistoricalData?.length > 0 && id &&
        <HistoryNotes label={label} historicalData={filteredHistoricalData} />
      }
    </Grid>
  );
};

ViewHistory.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  historicalData: PropTypes.array,
  methods: PropTypes.any
};

export default ViewHistory;
