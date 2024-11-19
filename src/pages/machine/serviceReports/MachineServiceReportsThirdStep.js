import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import b64toBlob from 'b64-to-blob';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dialog, DialogTitle, Divider, Stack } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
import FormLabel from '../../../components/DocumentForms/FormLabel';
// slice
import { updateMachineServiceReport, resetMachineServiceReport, addMachineServiceReportFiles, deleteReportFile, downloadReportFile } from '../../../redux/slices/products/machineServiceReport';
import { getActiveContacts, resetActiveContacts } from '../../../redux/slices/customer/contact';
// components
import ServiceRecodStepButtons from '../../../components/DocumentForms/ServiceRecodStepButtons';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField, RHFUpload } from '../../../components/hook-form';
import { MachineServiceReportPart3Schema } from '../../schemas/machine';
import SkeletonPDF from '../../../components/skeleton/SkeletonPDF';
import HistoryNotes from './HistoryNotes';

MachineServiceReportsThirdStep.propTypes = {
  handleDraftRequest: PropTypes.func,
  handleDiscard: PropTypes.func,
  handleBack: PropTypes.func
};

function MachineServiceReportsThirdStep({handleDraftRequest, handleDiscard, handleBack}) {
  
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { machineId, id } = useParams();
    const { machine } = useSelector((state) => state.machine);
    const { activeContacts } = useSelector((state) => state.contact);
    const { machineServiceReport } = useSelector((state) => state.machineServiceReport);

    const [ isDraft, setIsDraft ] = useState(false);
    const saveAsDraft = async () => setIsDraft(true);

    useEffect(() => {
      if (machine?.customer?._id) {
        dispatch(getActiveContacts(machine?.customer?._id));
      }
      return () =>{
          dispatch(resetActiveContacts());
      }
    }, [ dispatch, machine ]);

    const defaultValues = useMemo(
        () => {
          const initialValues = {
            serviceNote:                  '',
            recommendationNote:           '',
            internalComments:             '',
            suggestedSpares:              '',
            internalNote:                 '',
            operators:                    machineServiceReport?.operators || [],
            operatorNotes:                '',
            files: machineServiceReport?.files?.map(file => ({
              key: file?._id,
              _id: file?._id,
              name:`${file?.name}.${file?.extension}`,
              type: file?.fileType,
              fileType: file?.fileType,
              preview: `data:${file?.fileType};base64, ${file?.thumbnail}`,
              src: `data:${file?.fileType};base64, ${file?.thumbnail}`,
              path:`${file?.name}.${file?.extension}`,
              downloadFilename:`${file?.name}.${file?.extension}`,
              machineId:machineServiceReport?.machineId,
              primaryServiceReportId:id,
            })) || [],
            isActive:                     true,
        }
        return initialValues;
      },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ machineServiceReport ]
      );

    const methods = useForm({
        resolver: yupResolver(MachineServiceReportPart3Schema),
        defaultValues,
        mode: 'onChange',
        reValidateMode: 'onChange',
    });
    
    const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
    } = methods;

    useEffect(() => {
      if (machineServiceReport) {
        reset(defaultValues);
      }
      return(()=> resetMachineServiceReport());
    }, [reset, machineServiceReport, defaultValues]);

    const { isActive, files } = watch()
    
    const handleDropMultiFile = useCallback(
      async (acceptedFiles) => {
        const docFiles = files || [];
        const newFiles = acceptedFiles.map((file, index) => 
            Object.assign(file, {
              preview: URL.createObjectURL(file),
              src: URL.createObjectURL(file),
              isLoaded:true
            })
        );
        setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [ files ]
    );

    const onSubmit = async (data) => {
      try {
          if(isDraft){
            data.status='DRAFT'
          }else{
            data.status='SUBMITTED'  
          }
          data.isReportDocsOnly= false;
          if(id){
            if(Array.isArray(data?.files) && data?.files?.filter((f)=>!f?._id)?.length > 0){
              await dispatch(addMachineServiceReportFiles(machineId, id, data))
            }
            
            await dispatch(updateMachineServiceReport( machineId, id, data, isDraft ));
            await handleDraftRequest(isDraft);
            setIsDraft(false);  
            await navigate(PATH_MACHINE.machines.serviceReports.view(machineId, id))  
          }

          if(isDraft){
            await navigate(PATH_MACHINE.machines.serviceReports.root(machineId))
          }

    
        } catch (err) {
          console.error(err);
          enqueueSnackbar('Saving failed!', { variant: `error` });
        }
        setIsDraft(false);
      };

      const handleRemoveFile = async (inputFile) => {
        let images = getValues(`files`);
        if(inputFile?._id){
          await dispatch(deleteReportFile(machineId, id, inputFile?._id));
          images = await images?.filter((file) => ( file?._id !== inputFile?._id ))
        } else {
          images = await images?.filter((file) => ( file !== inputFile ))
        }
        setValue(`files`, images, { shouldValidate: true } )
      };

      const regEx = /^[^2]*/;
      const handleLoadImage = async (imageId) => {
        try {
          const response = await dispatch(downloadReportFile(machineId, id, imageId));
          if (regEx.test(response.status)) {
            const existingFiles = getValues('files');
            const imageIndex = existingFiles.findIndex(image => image?._id === imageId);
            if (imageIndex !== -1) {
              const image = existingFiles[imageIndex];
              existingFiles[imageIndex] = {
                ...image,
                src: `data:${image?.fileType};base64,${response.data}`,
                preview: `data:${image?.fileType};base64,${response.data}`,
                isLoaded: true,
              };
              setValue('files', existingFiles, { shouldValidate: true });
            }
          }
        } catch (error) {
          console.error('Error loading full file:', error);
        }
      };
      
      const [pdf, setPDF] = useState(null);
      const [PDFName, setPDFName] = useState('');
      const [PDFViewerDialog, setPDFViewerDialog] = useState(false);

      const handleOpenFile = async (file, fileName) => {
        setPDFName(fileName);
        setPDFViewerDialog(true);
        setPDF(null);
        try {
          if(!file?.isLoaded){
            const response = await dispatch(downloadReportFile(machineId, id, file._id));
            if (regEx.test(response.status)) {
              const blob = b64toBlob(encodeURI(response.data), 'application/pdf')
              const url = URL.createObjectURL(blob);
              setPDF(url);
            } else {
              enqueueSnackbar(response.statusText, { variant: 'error' });
            }
          }else{
            setPDF(file?.src);
          }
        } catch (error) {
          setPDFViewerDialog(false)
          if (error.message) {
            enqueueSnackbar(error.message, { variant: 'error' });
          } else {
            enqueueSnackbar('Something went wrong!', { variant: 'error' });
          }
        }
      };
  
  return (
    <>
      <FormProvider methods={methods}  onSubmit={handleSubmit(onSubmit)}>
        <Stack px={2} spacing={2}>    
          { machineServiceReport?.serviceReportTemplate?.enableNote && 
          <>
            <RHFTextField name="serviceNote" label={`${machineServiceReport?.serviceReportTemplate?.reportType?.toLowerCase() === 'install' ? 'Install' : 'Service' } Note`} minRows={3} multiline/> 
            <HistoryNotes historicalData={ machineServiceReport?.serviceNote } />
          </>
          }      
          { machineServiceReport?.serviceReportTemplate?.enableMaintenanceRecommendations && 
          <>
            <RHFTextField name="recommendationNote" label="Recommendation Note" minRows={3} multiline/> 
            <HistoryNotes historicalData={ machineServiceReport?.recommendationNote } />
          </>
          }
          { machineServiceReport?.serviceReportTemplate?.enableSuggestedSpares && 
          <>
            <RHFTextField name="suggestedSpares" label="Suggested Spares" minRows={3} multiline/> 
            <HistoryNotes historicalData={ machineServiceReport?.suggestedSpares } />
          </>
          }
          <RHFTextField name="internalNote" label="Internal Note" minRows={3} multiline/> 
          <HistoryNotes historicalData={ machineServiceReport?.internalNote } />

          <RHFAutocomplete 
            multiple
            disableCloseOnSelect
            filterSelectedOptions
            name="operators" 
            label="Operators"
            options={activeContacts}
            getOptionLabel={(option) => `${option?.firstName ||  ''} ${option?.lastName || ''}`}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}` }</li> )}
          />
          <RHFTextField name="operatorNotes" label="Operator Notes" minRows={3} multiline/> 
          <HistoryNotes historicalData={ machineServiceReport?.operatorNotes } />

          <FormLabel content='Documents / Images' />
          <RHFUpload multiple  thumbnail name="files" imagesOnly
            onDrop={handleDropMultiFile}
            dropZone={false}
            onRemove={handleRemoveFile}
            onLoadImage={handleLoadImage}
            onLoadPDF={handleOpenFile}
          />
          {/* <Grid container display="flex"><RHFSwitch name="isActive" label="Active"/></Grid> */}
      </Stack>
      <ServiceRecodStepButtons isActive={isActive} isSubmitting={isSubmitting} isDraft={isDraft} handleDraft={saveAsDraft} />
    </FormProvider>
    {PDFViewerDialog && (
      <Dialog fullScreen open={PDFViewerDialog} onClose={()=> setPDFViewerDialog(false)}>
        <DialogTitle variant='h3' sx={{pb:1, pt:2, display:'flex', justifyContent:'space-between'}}>
            PDF View
              <Button variant='outlined' onClick={()=> setPDFViewerDialog(false)}>Close</Button>
        </DialogTitle>
        <Divider variant='fullWidth' />
          {pdf?(
              <iframe title={PDFName} src={pdf} style={{paddingBottom:10}} width='100%' height='842px'/>
            ):(
              <SkeletonPDF />
            )}
      </Dialog>
    )}
  </>
)}

export default MachineServiceReportsThirdStep