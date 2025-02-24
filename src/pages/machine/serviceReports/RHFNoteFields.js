import React, { useState, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Grid, Button, Box } from '@mui/material';
import { useSnackbar } from '../../../components/snackbar';
import { useAuthContext } from '../../../auth/useAuthContext';
import { handleError } from '../../../utils/errorHandler';
import { RHFAutocomplete, RHFTextField } from '../../../components/hook-form';
import { addServiceReportNote, updateServiceReportNote, deleteServiceReportNote } from '../../../redux/slices/products/machineServiceReport';
import ViewNoteHistory from './ViewNoteHistory';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import FormProvider from '../../../components/hook-form/FormProvider';

const RHFNoteFields = ({ name, label, historicalData, saveHide, isTechnician, isOperator, setParentValue }) => {

  const dispatch = useDispatch()

  const { id } = useParams();
  const { user  } = useAuthContext()
  const { enqueueSnackbar } = useSnackbar();

  const { machineServiceReport } = useSelector((state) => state.machineServiceReport);
  const { activeSpContacts, activeContacts } = useSelector((state) => state.contact);

  const [ isEditing, setIsEditing ] = useState(false);
  const [ currentData, setCurrentData ] = useState(null);
  const [ techniciansList, setTechniciansList ] = useState([]);
  const [ loading, setLoading ] = useState(null);
  const reportNoteSchema = Yup.object().shape({
    technicians: Yup.array().label('Technicians').nullable(),
    operators: Yup.array().label('Operators').nullable(),
    note: Yup.string().max(5000).label('Notes').trim(),
    isPublic: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => {
      const initialValues = {
      _id:                currentData?._id || '',
      technicians:        currentData?.technicians || [],
      operators:          currentData?.operators || [],
      note:               currentData?.note || '',
      isPublic:           currentData?.isPublic || true,
    }
    return initialValues;
  }, [ currentData ] );

  const methods = useForm({
    resolver: yupResolver( reportNoteSchema ),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const {
    setValue,
    watch,
    trigger,
    formState: { isSubmitting },
  } = methods;

  const watchedValues = watch(); 
  const { _id, technicians, operators, note, isPublic } = watch(); 

  useEffect(()=>{
    setParentValue(name,{ _id, technicians, operators, note, isPublic });
    if( note?.trim() ){
      trigger('note');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ _id, technicians, operators, note, isPublic ])

  const isChanged = useMemo(() => 
    JSON.stringify(defaultValues) !== JSON.stringify(watchedValues)
  ,[watchedValues, defaultValues]);

  useEffect(() => {
    const sPContactUser = activeSpContacts?.filter( ( el )=> el?._id === user?.contact );
    let findTechnicians = activeSpContacts?.filter( ( el ) => el?.departmentDetails?.departmentType?.toLowerCase() === 'technical');
    if ( sPContactUser && !findTechnicians?.some( ( el ) => el?._id === user?.contact ) ) {
      findTechnicians = [ ...sPContactUser, ...findTechnicians ]
    }
    if( !machineServiceReport?._id ){
      setValue('technicians', sPContactUser || [] );
    }
    if (  Array.isArray( machineServiceReport?.technicians ) && 
          findTechnicians?.filter( ( el ) => (  machineServiceReport?.technicians?.some( msts => el?._id !== msts?._id )) ) 
        ) {
      findTechnicians = [ ...machineServiceReport.technicians, ...findTechnicians ];
      setValue('technicians', machineServiceReport?.technicians || [] );
    }
    findTechnicians = findTechnicians?.sort((a, b) => a?.firstName.localeCompare(b?.firstName) );
    setTechniciansList(findTechnicians);
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ activeSpContacts, user?.contact, id ]);



  const handleSave = methods.handleSubmit( async () => {
    try{
      setLoading(true);
      if( watchedValues?._id && isEditing ){
        await dispatch(updateServiceReportNote( id, watchedValues?._id, name, watchedValues ))
        enqueueSnackbar("Note updated successfully!");
        setIsEditing(false);
      } else {
        await dispatch(addServiceReportNote( id, name, watchedValues ))
        enqueueSnackbar("Note saved successfully!");
      }
      setValue('_id','');
      setValue('technicians',[]);
      setValue('operators',[]);
      setValue('note','');
      setValue('isPublic',true);
      setParentValue(name,'');
      setLoading(false);
    } catch (error){
      setLoading(false);
      enqueueSnackbar( handleError( error ) || "Note save failed!", { variant: `error` });
    }
  });

  const onEdit = async ( noteData ) => {
    setValue('_id',noteData?._id || '')
    setValue('technicians',noteData?.technicians || [])
    setValue('operators',noteData?.operators || [])
    setValue('note',noteData?.note || '')
    setValue('isPublic',noteData?.isPublic )
    await setCurrentData( noteData )
    await setIsEditing(true);
  };

  const handleCancel = () => { 
    setValue('_id','');
    setValue('technicians',[]);
    setValue('operators',[]);
    setValue('note','');
    setValue('isPublic',true);
    setParentValue(name,'');
    setIsEditing(false);
    setCurrentData(null)
  }

  const onDelete = async ( noteData ) => {
    try{
      setLoading(true);
      await dispatch( deleteServiceReportNote( id, noteData?._id, noteData?.type ) )
      enqueueSnackbar("Note deleted successfully!");
      setLoading(false);
    } catch (error){
      setLoading(false);
      enqueueSnackbar( handleError( error ) || "note delete failed!", { variant: `error` });
    }
  }

  return (
    <FormProvider methods={methods} >
      <Grid container >
          { ( name ||( currentData?.note && currentData?.note?.trim()) ) && 
            <FormLabel content={`${ label || currentData?.type || "Notes"}:`} /> }
          { (isEditing || name ) && methods && 
            <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              sx={{ mt:2, width: '100%' }}
              gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
            >
              { isTechnician && 
                <RHFAutocomplete
                  multiple
                  disableCloseOnSelect
                  filterSelectedOptions
                  name="technicians"
                  label="Technicians"
                  options={ techniciansList }
                  getOptionLabel={(option) => `${option?.firstName || ''} ${option?.lastName || ''}`}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>)}
                />
              }  
              { isOperator &&
                <RHFAutocomplete 
                  multiple
                  disableCloseOnSelect
                  filterSelectedOptions
                  name="operators" 
                  label="Operators"
                  options={ activeContacts }
                  getOptionLabel={(option) => `${option?.firstName ||  ''} ${option?.lastName || ''}`}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}` }</li> )}
                />
              }

              <RHFTextField 
                size='small'
                fullWidth
                multiline
                minRows={3}
                name='note'
                label={ label || currentData?.type || "Notes"}
              />  

              <Grid container display='flex' direction='row' alignItems="center" justifyContent='flex-end' >
                {/* <RHFSwitch label='Public' name='isPublic' /> */}
                { id &&
                  <>
                    { isEditing && <Button size='small' variant='outlined' onClick={ handleCancel } disabled={ loading } sx={{ mr: 1 }} >cancel</Button>}
                    { ( isEditing || !saveHide ) && <LoadingButton 
                      disabled={ !isChanged || loading || isSubmitting } 
                      onClick={ handleSave } 
                      loading={ loading || isSubmitting } 
                      size='small' 
                      variant='contained'
                    >
                      { isEditing ? "Update" : "Save" }
                    </LoadingButton>}
                  </>
                }
              </Grid>
            </Box>
          }
          <ViewNoteHistory historicalData={historicalData} isEditing={isEditing} onEdit={ id ? onEdit : undefined} onDelete={ id ? onDelete : undefined } />
      </Grid>
    </FormProvider>
  );
};

RHFNoteFields.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  historicalData: PropTypes.array,
  saveHide: PropTypes.bool,
  isTechnician: PropTypes.bool, 
  isOperator: PropTypes.bool,
  setParentValue: PropTypes.func
};

export default RHFNoteFields;
