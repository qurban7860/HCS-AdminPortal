import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Box, Grid, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { RHFTextField } from '../../../components/hook-form';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { FORMLABELS } from '../../../constants/default-constants';
import CheckedItemInputRow from './CheckedItemInputRow';
import FormProvider from '../../../components/hook-form/FormProvider';
import { PATH_MACHINE } from '../../../routes/paths';
import { MachineServiceRecordPart2Schema } from '../../schemas/machine';
import { deleteMachineServiceRecord, getMachineServiceRecord, getMachineServiceRecordCheckItems, setFormActiveStep, updateMachineServiceRecord } from '../../../redux/slices/products/machineServiceRecord';
import { getActiveServiceRecordConfigsForRecords, getServiceRecordConfig, resetServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';

MachineServiceRecordsSecondStep.propTypes = {
  // checkItemLists: PropTypes.array
  serviceRecord: PropTypes.object,
  handleDraftRequest: PropTypes.func,
  handleDiscard: PropTypes.func,
  handleBack: PropTypes.func
};

function MachineServiceRecordsSecondStep({serviceRecord, handleDraftRequest, handleDiscard, handleBack}) {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  
  const { machineServiceRecord, machineServiceRecordCheckItems, isLoading } = useSelector((state) => state.machineServiceRecord);
  const { serviceRecordConfig } = useSelector((state) => state.serviceRecordConfig);
  const { machine } = useSelector((state) => state.machine);
  
  const [ isDraft, setIsDraft ] = useState(false);
  const saveAsDraft = async () => setIsDraft(true);
  const [ checkItemLists, setCheckItemLists ] = useState([]);

  const [ textBeforeCheckItems, setTextBeforeCheckItems] = useState('');
  const [ textAfterCheckItems, setTextAfterCheckItems] = useState('');

  // useLayoutEffect(() =>{
  //   if(machine?._id && machineServiceRecord?._id){
  //     dispatch(getMachineServiceRecordCheckItems(machine?._id, machineServiceRecord?._id))
  //   }
  // },[dispatch, machine, machineServiceRecord])

  useEffect(() =>{
    setCheckItemLists(machineServiceRecordCheckItems?.checkItemLists|| [])
  },[dispatch, machineServiceRecordCheckItems])

  const defaultValues = useMemo(
      () => {
        const initialValues = {
        serviceRecordConfiguration:   machineServiceRecord?.serviceRecordConfig || null,
        serviceDate:                  machineServiceRecord?.serviceDate || new Date(),
        versionNo:                    machineServiceRecord?.versionNo || 1,
        technicianNotes:              machineServiceRecord?.technicianNotes || '',
        textBeforeCheckItems:         machineServiceRecord?.textBeforeCheckItems || '',
        textAfterCheckItems:          machineServiceRecord?.textAfterCheckItems || '',
        checkItemRecordValues:        machineServiceRecord?.checkItemRecordValues || [],
      }
      return initialValues;
    },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [ machineServiceRecord ]
    );

    useLayoutEffect(() =>{
      setTextBeforeCheckItems(defaultValues?.textBeforeCheckItems || '');
      setTextAfterCheckItems(defaultValues?.textAfterCheckItems || '');
    },[defaultValues])

    const formMethodsBefore = useForm({defaultValues});
    const { handleSubmit: handleSubmitBefore, formState: { isSubmitting: isSubmittingBefore, isSubmitted:isSubmittedBefore } } = formMethodsBefore;

    const formMethodsAfter = useForm({defaultValues});
    const { handleSubmit: handleSubmitAfter, formState: { isSubmitting: isSubmittingAfter, isSubmitted:isSubmittedAfter } } = formMethodsAfter;

    const methods = useForm({defaultValues});
    const { handleSubmit, formState: { isSubmitting } } = methods;

    const submitBefore = async (data)=> {
      const params = {
        textBeforeCheckItems: data.textBeforeCheckItems || ''
      }

      try {
        await dispatch(updateMachineServiceRecord(machine?._id, machineServiceRecord?._id, params));
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Saving failed!', { variant: `error` });
      }
    }

    const submitAfter = async (data)=> {
      const params = {
        textAfterCheckItems: data?.textAfterCheckItems || ''
      }
      
      try {
        await dispatch(updateMachineServiceRecord(machine?._id, machineServiceRecord?._id, params));
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Saving failed!', { variant: `error` });
      }
    }

    const onSubmit = async (data)=> {
            
            if(isDraft){
              data.status='DRAFT'
            }else{
              data.status='SUBMITTED'  
            }

            const params = {
                      textBeforeCheckItems: data.textBeforeCheckItems || '',
                      textAfterCheckItems: data.textAfterCheckItems || '',
                      status: data.status || 'DRAFT'
                    }
      try {
        await dispatch(updateMachineServiceRecord(machine?._id, machineServiceRecord?._id, params));
        
        if(isDraft){
          await handleDraftRequest(isDraft);
        }else{
          await dispatch(setFormActiveStep(2));
          await navigate(PATH_MACHINE.machines.serviceRecords.edit(machine?._id, machineServiceRecord?._id))
        }
        
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Saving failed!', { variant: `error` });
      }
    }

  return (
      <Stack mx={1} spacing={2}>
        <FormLabel content="Check Items value" />
            <FormProvider key='beforeForm' methods={formMethodsBefore} onSubmit={handleSubmitBefore(submitBefore)}>
            <Stack mx={1} spacing={2}>
              <RHFTextField name="textBeforeCheckItems" label="Text Before Check Items" minRows={3} multiline />
                <Grid container display='flex' direction='row-reverse'>
                  <LoadingButton type='submit' disabled={isSubmittedBefore} loading={isSubmittingBefore} size='small' variant='contained'>{isSubmittedBefore?"Saved!":"Save"}</LoadingButton>
                </Grid>
              </Stack>
            </FormProvider>
            {checkItemLists?.length > 0 && <FormLabel content={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />}
            {checkItemLists?.length===0 ? 
            <Box sx={{ width: '100%',mt:1 }}>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Box>
            :<>
              {checkItemLists?.map((row, index) =>
              <Stack key={`stack-${row._id}-${index}`} spacing={1}>
                <Typography key={`${row?._id}_${index}_name`} variant='h5'>
                    <b>{`${index+1}). `}</b>{typeof row?.ListTitle === 'string' && row?.ListTitle || ''}{' ( Items: '}<b>{`${row?.checkItems?.length}`}</b>{' ) '}
                </Typography>
                <CheckedItemInputRow 
                  key={`row-${row._id}-${index}`} index={index} row={row} machineId={machine?._id} serviceId={machineServiceRecord?.serviceId} />
              </Stack>
              )}
            </>
            }
            <FormProvider methods={formMethodsAfter}  key='afterForm' onSubmit={handleSubmitAfter(submitAfter)}>
              <Stack mx={1} spacing={2}>
                <RHFTextField name="textAfterCheckItems" label="Text After Check Items" minRows={3} multiline />
                <Grid container display='flex' direction='row-reverse'>
                  <LoadingButton type='submit' disabled={isSubmittedAfter} loading={isSubmittingAfter} size='small' variant='contained'>{isSubmittedAfter?"Saved!":"Save"}</LoadingButton>
                </Grid>
              </Stack>
            </FormProvider>
            
            <FormProvider methods={methods}  key='finalForm' onSubmit={handleSubmit(onSubmit)}>
              <AddFormButtons 
                  isSubmitting={isSubmitting} 
                  saveAsDraft={saveAsDraft}
                  isDraft={isDraft} 
                  saveButtonName="Next"
                  handleBack={handleBack} backButtonName="Back" 
                  toggleCancel={handleDiscard} cancelButtonName="Discard" 
              />

            </FormProvider>
      </Stack>
)}

export default MachineServiceRecordsSecondStep