import React from 'react'
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RHFTextField, RHFAutocomplete, RHFDatePicker } from '../../../components/hook-form';

MachineServiceRecordsFirstStep.propTypes = {
    activeServiceRecordConfigs: PropTypes.array,
    securityUsers: PropTypes.array,
    onChange : PropTypes.func
};

function MachineServiceRecordsFirstStep( { activeServiceRecordConfigs, securityUsers, onChange  } ) {

    const { recordTypes } = useSelector((state) => state.serviceRecordConfig);

  return (
    <>
                <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                >
                    <RHFAutocomplete 
                        name="docRecordType"
                        label="Document Type*"
                        options={recordTypes}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                        renderOption={(props, option) => (
                            <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>
                        )}
                    />

                    <RHFAutocomplete
                        name="serviceRecordConfiguration"
                        label="Service Record Configuration*"
                        options={activeServiceRecordConfigs}
                        getOptionLabel={(option) => `${option?.docTitle || ''} ${option?.docTitle ? '-' : '' } ${option.recordType || ''} ${option?.docVersionNo ? '- v' : '' }${option?.docVersionNo || ''}`}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option?.docTitle || ''} ${option?.docTitle ? '-' : '' } ${option.recordType || ''} ${option?.docVersionNo ? '- v' : '' }${option?.docVersionNo || ''}`}</li>
                        )}
                        onChange={onChange}
                    />
                </Box>       
                <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                >
                    <RHFDatePicker inputFormat='dd/MM/yyyy' name="serviceDate" label="Service Date" />
                    <RHFTextField name="versionNo" label="Version No" disabled/>
                </Box>
                    <RHFAutocomplete
                        name="technician"
                        label="Technician"
                        options={ securityUsers }
                        getOptionLabel={(option) => option?.name || ''}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        renderOption={(props, option) => ( <li {...props} key={option?._id}>{option.name || ''}</li>)}
                    />
                    <RHFTextField name="technicianNotes" label="Technician Notes" minRows={3} multiline/> 
    </>
)
}

export default MachineServiceRecordsFirstStep