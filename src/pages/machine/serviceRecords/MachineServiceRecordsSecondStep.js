import React, { createRef, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Box, Button, Grid, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { RHFTextField } from '../../../components/hook-form';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { FORMLABELS } from '../../../constants/default-constants';
import CheckedItemInputRow from './CheckedItemInputRow';
import FormProvider from '../../../components/hook-form/FormProvider';
import { PATH_MACHINE } from '../../../routes/paths';
import { MachineServiceRecordPart2Schema } from '../../schemas/machine';
import { deleteMachineServiceRecord, getMachineServiceRecord, getMachineServiceRecordCheckItems, resetCheckItemValues, setFormActiveStep, updateMachineServiceRecord } from '../../../redux/slices/products/machineServiceRecord';
import ServiceRecodStepButtons from '../../../components/DocumentForms/ServiceRecodStepButtons';

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
  const { machineId, id } = useParams();
  
  const { machineServiceRecord, machineServiceRecordCheckItems, isLoadingCheckItems } = useSelector((state) => state.machineServiceRecord);
  const { machine } = useSelector((state) => state.machine);
  
  const [ isDraft, setIsDraft ] = useState(false);
  const saveAsDraft = async () => setIsDraft(true);

  useEffect(() =>{
    if(machineId && id){
      dispatch(getMachineServiceRecord(machineId, id))
      dispatch(getMachineServiceRecordCheckItems(machineId, id));
    }
    return(()=> resetCheckItemValues());
  },[dispatch, machineId, id])

  const defaultValues = useMemo(
      () => {
        const initialValues = {
        serviceRecordConfiguration:   machineServiceRecord?.serviceRecordConfig || null,
        serviceDate:                  machineServiceRecord?.serviceDate || new Date(),
        versionNo:                    machineServiceRecord?.versionNo || 1,
        technicianNotes:              machineServiceRecord?.technicianNotes || '',
        textBeforeCheckItems:         machineServiceRecord?.textBeforeCheckItems || '',
        textAfterCheckItems:          machineServiceRecord?.textAfterCheckItems || '',
      }
      return initialValues;
    },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [ machineServiceRecord ]
    );

    const formMethodsBefore = useForm({defaultValues});
    const { handleSubmit: handleSubmitBefore, formState: { isSubmitting: isSubmittingBefore, isSubmitted:isSubmittedBefore } } = formMethodsBefore;

    const formMethodsAfter = useForm({defaultValues});
    const { handleSubmit: handleSubmitAfter, formState: { isSubmitting: isSubmittingAfter, isSubmitted:isSubmittedAfter } } = formMethodsAfter;

    const methods = useForm({defaultValues});
    const { handleSubmit, formState: { isSubmitting } } = methods;

    const [showMessage, setShowMessage] = useState(false);
    const submitBefore = async (data)=> {
      const params = {
        textBeforeCheckItems: data.textBeforeCheckItems || ''
      }
      try {
        await dispatch(updateMachineServiceRecord(machineId, id, params));
        setShowMessage(true);
        setTimeout(() => {setShowMessage(false)}, 3000);
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
        await dispatch(updateMachineServiceRecord(machineId, id, params));
        setShowMessage(true);
        setTimeout(() => {setShowMessage(false)}, 3000);
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Saving failed!', { variant: `error` });
      }
    }

    const onSubmit = async (data)=> {
      const params = {
        textBeforeCheckItems: data?.textBeforeCheckItems || '',
        textAfterCheckItems: data?.textAfterCheckItems || ''
      }
      
      try {

          if(isDraft){
            await dispatch(updateMachineServiceRecord(machineId, id, params));
            await handleDraftRequest(isDraft);
          }else{
            await dispatch(setFormActiveStep(2));
          }        
      
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Saving failed!', { variant: `error` });
      }
    }

  return (
      <Stack spacing={2}>
            <FormProvider key='beforeForm' methods={formMethodsBefore} onSubmit={handleSubmitBefore(submitBefore)}>
            <Stack px={2} spacing={2}>
              <RHFTextField name="textBeforeCheckItems" label="Text Before Check Items" minRows={3} multiline />
                <Grid container display='flex' direction='row' justifyContent='flex-end' gap={2}>
                  {isSubmittedBefore && showMessage && <Typography variant='body2' color='green' sx={{mt:0.5}}>Saved Successfully!</Typography>}
                  <LoadingButton type='submit' loading={isSubmittingBefore} size='small' variant='contained'>Save</LoadingButton>
                </Grid>
              </Stack>
            </FormProvider>
            {isLoadingCheckItems? 
              <Stack px={2} spacing={2}>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
              </Stack>
              :<>
                {machineServiceRecordCheckItems?.checkItemLists?.map((row, index) =>
                    <CheckedItemInputRow key={`row-${row._id}-${index}`} index={index} row={row} />
                )}   
              </>
            }

            <FormProvider methods={formMethodsAfter}  key='afterForm'>
              <Stack px={2} spacing={2}>
                <RHFTextField name="textAfterCheckItems" label="Text After Check Items" minRows={3} multiline />
                <Grid container display='flex' direction='row' justifyContent='flex-end' gap={2}>
                  {isSubmittedAfter && showMessage && <Typography variant='body2' color='green' sx={{mt:0.5}}>Saved Successfully!</Typography>}
                  <LoadingButton onClick={handleSubmitAfter(submitAfter)} loading={isSubmittingAfter} size='small' variant='contained'>Save</LoadingButton>
                </Grid>
              </Stack>
            </FormProvider>
            <FormProvider methods={methods}  key='submit' onSubmit={handleSubmit(onSubmit)}>
              <ServiceRecodStepButtons isDraft={isDraft} isSubmitting={isSubmitting} handleDraft={saveAsDraft} />
            </FormProvider>
      </Stack>
)}

export default MachineServiceRecordsSecondStep