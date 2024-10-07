import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Box,
  Typography,
  Stack,
  Button,
} from '@mui/material';
import Iconify from '../iconify';
import { BUTTONS } from '../../constants/default-constants';

RHFFilteredSearchBar.propTypes = {
  name: PropTypes.string.isRequired,
  filterOptions: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  helperText: PropTypes.node,
  size: PropTypes.string,
  selectedFilter: PropTypes.string.isRequired,
  setSelectedFilter: PropTypes.func.isRequired,
};
export default function RHFFilteredSearchBar({
  name,
  filterOptions,
  size = 'small',
  placeholder,
  helperText,
  selectedFilter,
  setSelectedFilter = () => {},
  ...other
}) {
  const { control, watch, setValue } = useFormContext();
  const [error, setError] = useState('');

  const searchKey = watch(name);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!selectedFilter) setError('Please select a filter option to enable search');
  }, [selectedFilter, setError]);

  const clearSearchKey = () => {
    setValue(name, '');
    setSelectedFilter('');
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error: fieldError } }) => (
        <Stack spacing={0}>
          <TextField
            {...field}
            fullWidth
            placeholder={placeholder}
            error={!!fieldError}
            size={size}
            label="Search"
            disabled={!selectedFilter}
            sx={{
              flexDirection: isMobile ? 'column' : 'row',
              '& .MuiInputBase-root': {
                flexDirection: isMobile ? 'column' : 'row',
              },
              '& .MuiInputAdornment-root': {
                marginTop: isMobile ? 0 : 'auto',
                marginBottom: isMobile ? 1 : 'auto',
              },
              '& .MuiInputBase-input': {
                paddingLeft: isMobile ? '14px' : 'inherit',
              },
            }}
            {...other}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ mr: 0, ml: 0, height: '100%', width: isMobile ? '100%' : 'auto' }}
                >
                  <Select
                    value={selectedFilter}
                    onChange={(e) => {
                      setSelectedFilter(e.target.value);
                      setError('');
                    }}
                    displayEmpty
                    size={size}
                    sx={{
                      minWidth: isMobile ? '100%' : 120,
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                      '& .MuiSelect-select': {
                        paddingRight: isMobile ? 'unset' : 0,
                        paddingLeft: isMobile ? 4.5 : 0,
                        paddingTop: isMobile ? undefined : 0,
                        paddingBottom: isMobile ? 'unset' : 0,
                      },
                      boxShadow: 'none',
                      borderRight: isMobile ? 'none' : '2px solid',
                      borderBottom: isMobile ? '2px solid' : 'none',
                      borderRadius: 0,
                      borderColor: 'divider',
                      paddingRight: 1,
                      marginRight: 1,
                      color: selectedFilter === '' ? 'text.secondary' : 'text.primary',
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          marginTop: 2,
                          marginLeft: isMobile ? 0 : '-8px',
                          width: isMobile ? '100%' : 'auto',
                          maxHeight: 300,
                          overflowY: 'auto',
                        },
                      },
                    }}
                  >
                    <MenuItem dense value="" disabled sx={{ color: 'text.secondary' }}>
                      Select filter
                    </MenuItem>
                    {filterOptions.map((option) => (
                      <MenuItem key={option?.id} value={option?.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', mr: 1 }} />
                </InputAdornment>
              ),
              endAdornment: searchKey?.length > 0 && (
                <InputAdornment position="end">
                  <Button
                    fullWidth
                    onClick={clearSearchKey}
                    color="error"
                    size="small"
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                  >
                    {BUTTONS.CLEAR}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ minHeight: '20px' }}>
            {(fieldError || error || helperText) && (
              <Typography variant="caption" color="text.disabled" sx={{ marginLeft: 1 }}>
                {fieldError ? fieldError.message : error || helperText}
              </Typography>
            )}
          </Box>
        </Stack>
      )}
    />
  );
}
