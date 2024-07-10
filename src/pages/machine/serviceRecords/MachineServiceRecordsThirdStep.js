import React from 'react'
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RHFTextField, RHFAutocomplete, RHFSwitch } from '../../../components/hook-form';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import { ThumbnailDocButton } from '../../../components/Thumbnails';

MachineServiceRecordsThirdStep.propTypes = {
    serviceRecordConfig: PropTypes.object,
    docRecordType: PropTypes.object,
    files: PropTypes.array,
    handleOpenLightbox: PropTypes.func,
    handleDownloadFile: PropTypes.func,
    handleDeleteFile: PropTypes.func,
    handleAddFileDialog : PropTypes.func
};

function MachineServiceRecordsThirdStep( { serviceRecordConfig, docRecordType, files, handleOpenLightbox, handleDownloadFile, handleDeleteFile, handleAddFileDialog } ) {

    const { activeContacts } = useSelector((state) => state.contact);

  return (
    <>
                    { serviceRecordConfig?.enableNote && <RHFTextField name="serviceNote" label={`${docRecordType?.name?.charAt(0).toUpperCase()||''}${docRecordType?.name?.slice(1).toLowerCase()||''} Note`} minRows={3} multiline/> }
                    { serviceRecordConfig?.enableMaintenanceRecommendations && <RHFTextField name="recommendationNote" label="Recommendation Note" minRows={3} multiline/> }
                    { serviceRecordConfig?.enableSuggestedSpares && <RHFTextField name="suggestedSpares" label="Suggested Spares" minRows={3} multiline/> }
                    
                    <RHFTextField name="internalNote" label="Internal Note" minRows={3} multiline/> 

                      <RHFAutocomplete 
                        multiple
                        disableCloseOnSelect
                        filterSelectedOptions
                        name="operators" 
                        label="Operators"
                        options={activeContacts}
                        getOptionLabel={(option) => `${option?.firstName ||  ''} ${option.lastName || ''}`}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      />

                    <RHFTextField name="operatorNotes" label="Operator Notes" minRows={3} multiline/> 
                    {files?.map((file, _index) => (
                      <DocumentGalleryItem isLoading={!files} key={file?.id} image={file} 
                        onOpenLightbox={()=> handleOpenLightbox(_index)}
                        onDownloadFile={()=> handleDownloadFile(file._id, file?.name, file?.extension)}
                        onDeleteFile={()=> handleDeleteFile(file._id)}
                        toolbar
                      />
                    ))}

                    <ThumbnailDocButton onClick={handleAddFileDialog}/>

                    {/* <RHFUpload multiple  thumbnail name="files" imagesOnly
                      onDrop={handleDropMultiFile}
                      onRemove={(inputFile) =>
                        files.length > 1 ?
                        setValue(
                          'files',
                          files &&
                            files?.filter((file) => file !== inputFile),
                          { shouldValidate: true }
                        ): setValue('files', '', { shouldValidate: true })
                      }
                      onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
                    /> */}

                  <Grid container display="flex">
                    <RHFSwitch name="isActive" label="Active"/>
                  </Grid>
    </>
)
}

export default MachineServiceRecordsThirdStep