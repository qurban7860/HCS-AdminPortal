import React from 'react'
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Box, Grid, Stack } from '@mui/material';
import { m } from 'framer-motion';
import FileThumbnail, { fileData } from '../../components/file-thumbnail';
import { varFade } from '../../components/animate';
import { RHFAutocomplete, RHFTextField } from '../../components/hook-form';


export default function FileRow({
    i,
    file,
    docCategory,
}){
    
    const { key, displayName, docType } = fileData(file);
    const { activeDocumentTypes } = useSelector((state) => state.documentType);

  return (
    <Stack
        key={key }
        component={m.div}
        {...varFade().inUp}
        spacing={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={(theme)=>({ my: 1.5, px: 1.5, py: 1.25, borderRadius: 0.75,
          border:`solid 1px ${ ( docType && displayName?.trim() ) ? theme.palette.divider : theme.palette.error.main}`,
        })}
    >

        <Stack direction="row" sx={{ width:"100%" }} >
            <FileThumbnail file={file} />
            <Stack spacing={1} sx={{ml:3, width:"100%" }} >
                <Stack direction={{ sm: 'block', md: 'row' }} spacing={1} >
                    <Grid item md={4} sm={12} >
                        <RHFAutocomplete 
                            Error={ !docType?._id }
                            size='small'
                            name={`files[${i}].docType`}
                            label="Type*"
                            options={
                                docCategory?._id 
                                ? activeDocumentTypes.filter(dT => dT?.docCategory?._id === docCategory?._id) 
                                : []
                            }
                            isOptionEqualToValue={( option, value ) => option?._id === value?._id }
                            getOptionLabel={(option) => `${option?.name || ''}`}
                            renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option?.name || ''}`}</li>)}
                        />
                    </Grid>
                    <Grid item md={8} sm={12} >
                        <RHFTextField 
                            fullWidth 
                            size='small'
                            Error={ displayName?.trim() === '' }
                            name={`files[${i}].displayName`}
                            label="Document Name*"
                        />
                    </Grid>
                </Stack>
                <Box 
                    rowGap={1} 
                    columnGap={1} 
                    display="grid" 
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} 
                > 
                    <RHFTextField 
                        size='small'
                        label="Reference No." 
                        name={`files[${i}].referenceNumber`}
                    /> 
                    <RHFTextField 
                        size='small' 
                        label="Stock No." 
                        name={`files[${i}].stockNumber`}
                    />
                    
                    <RHFTextField 
                        size='small'
                        label="Version No."
                        name={`files[${i}].versionNo`}
                    />
                </Box>
            </Stack>
        </Stack>
    </Stack>
  )
}

FileRow.propTypes = {
    i: PropTypes.number,
    file: PropTypes.object,
    docCategory: PropTypes.object,
};
