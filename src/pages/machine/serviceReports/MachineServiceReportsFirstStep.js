import React, { useEffect, useLayoutEffect, useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types';
import b64toBlob from 'b64-to-blob';
import { Box, Button, Dialog, DialogTitle, Divider, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import FormProvider from '../../../components/hook-form/FormProvider';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { RHFAutocomplete, RHFDatePicker, RHFUpload } from '../../../components/hook-form';
import { MachineServiceReportPart1Schema } from '../../schemas/machine';
import { useAuthContext } from '../../../auth/useAuthContext';
import { PATH_MACHINE } from '../../../routes/paths';
import { getActiveSPContacts, resetActiveSPContacts } from '../../../redux/slices/customer/contact';
import { addMachineServiceReport, setFormActiveStep, updateMachineServiceReport, addMachineServiceReportFiles, deleteReportFile, downloadReportFile  } from '../../../redux/slices/products/machineServiceReport';
import { getActiveServiceReportTemplatesForRecords, resetServiceReportTemplate } from '../../../redux/slices/products/serviceReportTemplate';
import ServiceRecodStepButtons from '../../../components/DocumentForms/ServiceRecodStepButtons';
import SkeletonLine from '../../../components/skeleton/SkeletonLine';
import SkeletonPDF from '../../../components/skeleton/SkeletonPDF';
import ViewHistory from './ViewHistory';

MachineServiceReportsFirstStep.propTypes = {
    handleComplete : PropTypes.func,
    handleDraftRequest: PropTypes.func,
    handleDiscard: PropTypes.func,
};

function MachineServiceReportsFirstStep( { handleComplete, handleDraftRequest, handleDiscard } ) {
    
    const regEx = /^[^2]*/;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { machineId, id } = useParams();
    const { user  } = useAuthContext()
    const { reportTypes, activeServiceReportTemplatesForRecords } = useSelector((state) => state.serviceReportTemplate);
    const { activeSpContacts } = useSelector((state) => state.contact);
    const { machineServiceReport, isLoading } = useSelector((state) => state.machineServiceReport);
    const { machine } = useSelector((state) => state.machine);
    const [ technicians, setTechnicians ] = useState([]);
    const [ isDraft, setIsDraft ] = useState(false);
    const [ isSubmit, setIsSubmit ] = useState(false);
    const saveAsDraft = async () => setIsDraft(true);
    const saveAsSubmit = async () => setIsSubmit(true);
    const machineDecoilers = (machine?.machineConnections || [])?.map((decoiler) => ({
      _id: decoiler?.connectedMachine?._id ?? null,
      name: decoiler?.connectedMachine?.name ?? null,
      serialNo: decoiler?.connectedMachine?.serialNo ?? null
    }));

    useLayoutEffect(() => {
      dispatch(getActiveServiceReportTemplatesForRecords(machineId));
      dispatch(getActiveSPContacts());
      return () =>{
          dispatch(resetActiveSPContacts());
          dispatch(resetServiceReportTemplate())
      }
    }, [ dispatch, machineId ]);

    const defaultValues = useMemo(
      () => {
        const initialValues = {
        docReportType:                reportTypes.find(rt=> rt?.name?.toLowerCase() === machineServiceReport?.serviceReportTemplate?.reportType?.toLowerCase()) || null,
        serviceReportTemplate:        machineServiceReport?.serviceReportTemplate || null,
        serviceDate:                  machineServiceReport?.serviceDate || new Date(),
        technician:                   machineServiceReport?.technician || null ,
        technicianNotes:              '',
        textBeforeCheckItems:         '',
        textAfterCheckItems:          '',
        files: machineServiceReport?.reportDocs?.map(file => ({
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
          primaryServiceReportId: id,
        })) || [],
      }
      return initialValues;
    }, [ machineServiceReport, reportTypes, id ] );

    const methods = useForm({
        resolver: yupResolver(MachineServiceReportPart1Schema),
        defaultValues,
        mode: 'onBlur',
        reValidateMode: 'onSubmit',
    });
    
    const {
    reset,
    watch,
    setValue,
    getValues,
    trigger,
    handleSubmit,
    formState: { isSubmitting },
    } = methods;

  useEffect(() => {
    const sPContactUser = activeSpContacts?.find( ( el )=> el?._id === user?.contact );
    let techniciansList = activeSpContacts?.filter( ( el ) => el?.departmentDetails?.departmentType?.toLowerCase() === 'technical');
    if ( sPContactUser && !techniciansList?.some( ( el ) => el?._id === user?.contact ) ) {
      techniciansList = [ sPContactUser, ...techniciansList ]
    }
    if( !machineServiceReport?._id ){
      setValue('technician', sPContactUser || null );
    }
    if ( machineServiceReport?.technician?._id && techniciansList?.some( ( el ) => ( el?._id !== machineServiceReport?.technician?._id ) ) ) {
      techniciansList = [ machineServiceReport?.technician, ...techniciansList ];
      setValue('technician', machineServiceReport?.technician || null );
    }
    techniciansList = techniciansList?.sort((a, b) => a?.firstName.localeCompare(b?.firstName) );
    setTechnicians(techniciansList);
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ activeSpContacts, setValue, user?.contact, id ]);

    useEffect(() => {
      if (machineServiceReport) {
        reset(defaultValues);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset, machineServiceReport ]);

    const { docReportType, serviceReportTemplate, files } = watch();


      const onSubmit = async (data) => {
        try {

          if(isSubmit){
            data.status = 'SUBMITTED'
          }
          if(!data.technician){
            data.technician = null;
          }
          data.isReportDoc = true
          if(!id ){
            data.isReportDocsOnly = true;
            data.decoilers = machineDecoilers;
            const serviceReport = await dispatch(addMachineServiceReport(machineId, data));
            dispatchFiles( serviceReport?._id, data );
            if( isSubmit ){
              await navigate(PATH_MACHINE.machines.serviceReports.view(machineId, serviceReport?._id))
            } else {
              await navigate(PATH_MACHINE.machines.serviceReports.edit(machineId, serviceReport?._id))
            }
          }else {
            await dispatch(updateMachineServiceReport(machineId, id, data));
            dispatchFiles( id, data );
            if( isSubmit ){
              await navigate(PATH_MACHINE.machines.serviceReports.view(machineId, id))
            } else {
              await navigate(PATH_MACHINE.machines.serviceReports.edit(machineId, id))  
            }
          }

          if(isDraft){
            await handleDraftRequest(isDraft);
          }else if(!isSubmit){
            await dispatch(setFormActiveStep(1));
            await handleComplete(0);
          }
    
        } catch (err) {
          console.error(err);
          enqueueSnackbar( typeof err === 'string' ? err : 'Saving failed!', { variant: `error` });
        }
      };
    const dispatchFiles = async ( serviceReportId,data )  => {
      if(Array.isArray(data?.files) && data?.files?.length > 0){
        const filteredFiles = data?.files?.filter((ff)=> !ff?._id)
        if(Array.isArray(filteredFiles) && filteredFiles?.length > 0){
            await dispatch(addMachineServiceReportFiles(machineId, serviceReportId, { files: filteredFiles, isReportDoc: data?.isReportDoc } ))
        }
      }
    }

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
        try {
        setPDFName(fileName);
        setPDFViewerDialog(true);
        setPDF(null);
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
          setPDFViewerDialog(false);
          if (error.message) {
            enqueueSnackbar(error.message, { variant: 'error' });
          } else {
            enqueueSnackbar('Something went wrong!', { variant: 'error' });
          }
        }
      };

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

return (
  <>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {isLoading?
          <Stack px={2} spacing={2}>
            {
              Array.from({ length: 8 }).map((_, index) => (
                <SkeletonLine key={index} />
              ))
            }
          </Stack>
        :
        <>
          <Stack px={2} spacing={2}>
              <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  sx={{width:'100%'}}
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
                  >
                  
                  <RHFDatePicker inputFormat='dd/MM/yyyy' name="Service Date" label="Service Date" />

                  <RHFAutocomplete 
                      name="docReportType"
                      label="Report Type*"
                      disabled={id && true }
                      options={reportTypes}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                      onChange={(event, newValue) =>{
                        if(newValue){
                            setValue('docReportType',newValue)
                            if( serviceReportTemplate?.reportType?.toUpperCase() !== newValue?.name?.toUpperCase() ){
                              setValue('serviceReportTemplate',null)
                            }
                          } else {
                            setValue('serviceReportTemplate',null )
                            setValue('docReportType', null )
                          }
                          trigger('serviceReportTemplate')
                          trigger('docReportType')
                        }
                      }
                  />

                  <RHFAutocomplete
                    name="serviceReportTemplate"
                    label="Service Report Template*"
                    disabled={id && true }
                    options={activeServiceReportTemplatesForRecords?.filter( src => !docReportType || src?.reportType?.toLowerCase() === docReportType?.name?.toLowerCase() )}
                    getOptionLabel={(option) => `${option?.reportTitle || ''} ${option?.reportTitle ? '-' : '' } ${option.reportType || ''} ${option?.docVersionNo ? '- v' : '' }${option?.docVersionNo || ''}`}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option?.reportTitle || ''} ${option?.reportTitle ? '-' : '' } ${option.reportType || ''} ${option?.docVersionNo ? '- v' : '' }${option?.docVersionNo || ''}`}</li>
                      )}
                      onChange={(event, newValue) =>{
                        if(newValue){
                          setValue('serviceReportTemplate',newValue)
                          if(!docReportType || newValue?.reportType?.toUpperCase() !== docReportType?.name?.toUpperCase() ){
                            setValue('docReportType',reportTypes?.find((rt)=> rt?.name?.toUpperCase() === newValue?.reportType?.toUpperCase()))
                          }
                          setValue('textBeforeCheckItems',newValue?.textBeforeCheckItems || '')
                          setValue('textAfterCheckItems',newValue?.textAfterCheckItems || '')
                        } else {
                          setValue('serviceReportTemplate',null )
                          setValue('textBeforeCheckItems', '')
                          setValue('textAfterCheckItems', '')
                        }
                        trigger('docReportType')
                        trigger('serviceReportTemplate')
                      }
                    }
                    />
                  </Box> 
                    <RHFAutocomplete
                      name="technician"
                      label="Technician"
                      options={ technicians }
                      getOptionLabel={(option) => `${option?.firstName || ''} ${option?.lastName || ''}`}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>)}
                    />

                  {/* <RHFTextField name="technicianNotes" label="Technician Notes" minRows={3} multiline/>  */}
                  <ViewHistory 
                    name="technicianNotes" 
                    label="Technician Notes" 
                    historicalData={ machineServiceReport?.technicianNotes }
                    methods={methods}
                  />
                  <FormLabel content='Reporting Documents' />
                  <RHFUpload multiple  thumbnail name="files" imagesOnly
                    onDrop={handleDropMultiFile}
                    dropZone={false}
                    onRemove={handleRemoveFile}
                    onLoadImage={handleLoadImage}
                    onLoadPDF={handleOpenFile}
                  />
          </Stack>
          <ServiceRecodStepButtons handleSubmit={saveAsSubmit} isSubmitted={isSubmit} handleDraft={saveAsDraft} isDraft={isDraft} isSubmitting={isSubmitting} />
          </>
        }
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
)
}

export default MachineServiceReportsFirstStep