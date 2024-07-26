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
  
  const { machineServiceRecord, machineServiceRecordCheckItems, isLoading } = useSelector((state) => state.machineServiceRecord);
  const { serviceRecordConfig } = useSelector((state) => state.serviceRecordConfig);
  const { machine } = useSelector((state) => state.machine);
  
  const [ isDraft, setIsDraft ] = useState(false);
  const saveAsDraft = async () => setIsDraft(true);
  const [ checkItemLists, setCheckItemLists ] = useState([]);

  const [ textBeforeCheckItems, setTextBeforeCheckItems] = useState('');
  const [ textAfterCheckItems, setTextAfterCheckItems] = useState('');

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

    const [showMessage, setShowMessage] = useState(false);
    const submitBefore = async (data)=> {
      const params = {
        textBeforeCheckItems: data.textBeforeCheckItems || ''
      }
      try {
        await dispatch(updateMachineServiceRecord(machine?._id, machineServiceRecord?._id, params));
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
        await dispatch(updateMachineServiceRecord(machine?._id, machineServiceRecord?._id, params));
        setShowMessage(true);
        setTimeout(() => {setShowMessage(false)}, 3000);
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Saving failed!', { variant: `error` });
      }
    }

    const onSubmit = async (data)=> {
      await saveAsDraft();
      const params = {
        textBeforeCheckItems: data?.textBeforeCheckItems || '',
        textAfterCheckItems: data?.textAfterCheckItems || ''
      }
      
      try {
        await dispatch(updateMachineServiceRecord(machine?._id, machineServiceRecord?._id, params));
        await handleDraftRequest(isDraft);
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
                  <CheckedItemInputRow key={`row-${row._id}-${index}`} index={index} row={row} machineId={machine?._id} serviceId={machineServiceRecord?.serviceId} />
                )}
              </>
            }
            <FormProvider methods={formMethodsAfter}  key='afterForm' onSubmit={handleSubmitAfter(submitAfter)}>
              <Stack px={2} spacing={2}>
                <RHFTextField name="textAfterCheckItems" label="Text After Check Items" minRows={3} multiline />
                <Grid container display='flex' direction='row' justifyContent='flex-end' gap={2}>
                  {isSubmittedAfter && showMessage && <Typography variant='body2' color='green' sx={{mt:0.5}}>Saved Successfully!</Typography>}
                  <LoadingButton type='submit' loading={isSubmittingAfter} size='small' variant='contained'>Save</LoadingButton>
                </Grid>
              </Stack>
            </FormProvider>
            <ServiceRecodStepButtons isDraft={isDraft} isSubmitting={isSubmitting} handleDraft={handleSubmit(onSubmit)} />
      </Stack>
)}

export default MachineServiceRecordsSecondStep