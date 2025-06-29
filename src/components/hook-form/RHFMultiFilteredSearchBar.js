import PropTypes from 'prop-types';
import { useEffect, useState, useCallback, useMemo } from 'react';
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
  Chip,
  FormControl,
  ListItemText,
  Checkbox,
  Tooltip,
  Alert,
  Collapse,
  Divider,
} from '@mui/material';
import Iconify from '../iconify';

RHFMultiFilteredSearchBar.propTypes = {
  name: PropTypes.string.isRequired,
  filterOptions: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  helperText: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium']),
  selectedFilters: PropTypes.array.isRequired,
  setSelectedFilters: PropTypes.func.isRequired,
  afterClearHandler: PropTypes.func,
  maxSelectedDisplay: PropTypes.number,
  maxSelections: PropTypes.number,
  showChips: PropTypes.bool,
  autoSelectFirst: PropTypes.bool,
  disabled: PropTypes.bool,
  searchOnType: PropTypes.bool,
  onSearchChange: PropTypes.func,
};

export default function RHFMultiFilteredSearchBar({
  name,
  filterOptions = [],
  size = 'small',
  placeholder = 'Search...',
  helperText,
  selectedFilters = [],
  setSelectedFilters = () => {},
  afterClearHandler = () => {},
  maxSelectedDisplay = 2,
  maxSelections = null, // null means unlimited
  showChips = true,
  autoSelectFirst = true,
  disabled = false,
  searchOnType = false,
  onSearchChange = () => {},
  ...other
}) {
  const { control, watch, setValue } = useFormContext();
  const [error, setError] = useState('');
  const [showMaxSelectionWarning, setShowMaxSelectionWarning] = useState(false);

  const searchKey = watch(name);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isSearchDisabled = useMemo(() => 
    disabled || selectedFilters.length === 0, 
    [disabled, selectedFilters.length]
  );

  const selectedFilterOptions = useMemo(() => 
    selectedFilters.map(filterId => 
      filterOptions.find(opt => opt.id === filterId)
    ).filter(Boolean), 
    [selectedFilters, filterOptions]
  );

  const isMaxSelectionsReached = useMemo(() => 
    maxSelections && selectedFilters.length >= maxSelections,
    [maxSelections, selectedFilters.length]
  );

  // for auto-selecting first option if none selected
  useEffect(() => {
    if (autoSelectFirst && selectedFilters.length === 0 && filterOptions.length > 0) {
      setSelectedFilters([filterOptions[0].id]);
    }
  }, [selectedFilters.length, filterOptions, setSelectedFilters, autoSelectFirst]);

  // for incase debounce is enabled
  useEffect(() => {
    if (searchOnType && searchKey) {
      const timeoutId = setTimeout(() => {
        onSearchChange(searchKey, selectedFilters);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [searchKey, selectedFilters, searchOnType, onSearchChange]);

  const clearAll = useCallback(() => {
    setValue(name, '');
    setSelectedFilters([]);
    setError('');
    setShowMaxSelectionWarning(false);
    afterClearHandler();
  }, [setValue, name, setSelectedFilters, afterClearHandler]);

  const clearSearchOnly = useCallback(() => {
    setValue(name, '');
    afterClearHandler();
  }, [setValue, name, afterClearHandler]);

  const handleFilterChange = useCallback((event) => {
    const {value} = event.target;
    const newFilters = typeof value === 'string' ? value.split(',') : value;
    
    // max selections limit
    if (maxSelections && newFilters.length > maxSelections) {
      setShowMaxSelectionWarning(true);
      setTimeout(() => setShowMaxSelectionWarning(false), 3000);
      return;
    }
    
    // clear search if no filters left
    if (newFilters.length === 0) {
      setValue(name, '');
    }
    
    setSelectedFilters(newFilters);
    setError('');
    setShowMaxSelectionWarning(false);
  }, [maxSelections, name, setSelectedFilters, setValue]);

  const removeFilter = useCallback((filterToRemove) => {
    const newFilters = selectedFilters.filter(filter => filter !== filterToRemove);
    setSelectedFilters(newFilters);
    
    // clear search if no filters left
    if (newFilters.length === 0) {
      setValue(name, '');
    }
  }, [selectedFilters, setSelectedFilters, setValue, name]);

  const renderSelectedFilters = useCallback(() => {
    if (selectedFilters.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          Select columns to search
        </Typography>
      );
    }

    const selectedLabels = selectedFilterOptions.map(option => option.label);

    if (selectedLabels.length <= maxSelectedDisplay) {
      return selectedLabels.join(', ');
    }

    return `${selectedLabels.slice(0, maxSelectedDisplay).join(', ')} +${selectedLabels.length - maxSelectedDisplay} more`;
  }, [selectedFilters.length, selectedFilterOptions, maxSelectedDisplay]);

  const getMenuItemProps = useCallback((option) => {
    const isSelected = selectedFilters.includes(option.id);
    const isDisabled = !isSelected && isMaxSelectionsReached;
    
    return {
      key: option.id,
      value: option.id,
      disabled: isDisabled,
      sx: {
        opacity: isDisabled ? 0.5 : 1,
        '&.Mui-disabled': {
          opacity: 0.5,
        },
      },
    };
  }, [selectedFilters, isMaxSelectionsReached]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error: fieldError } }) => (
        <Stack spacing={1}>
          <TextField
            {...field}
            fullWidth
            placeholder={selectedFilters?.length > 0 ? placeholder : "Select filters first..."}
            error={!!fieldError}
            size={size}
            label="Search"
            disabled={isSearchDisabled}
            sx={{
              '& .MuiInputBase-root': {
                paddingRight: 1,
              },
            }}
            onChange={(e) => {
              field.onChange(e);
              if (e.target.value === '') {
                afterClearHandler();
              }
            }}
            {...other}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify 
                    icon="mdi:search" 
                    sx={{ 
                      color: isSearchDisabled ? 'text.disabled' : 'text.secondary',
                      transition: 'color 0.2s ease',
                    }} 
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Stack direction="row" spacing={1} alignItems="center">
                    {searchKey?.length > 0 && (
                      <Tooltip title="Clear search">
                        <Button
                          onClick={clearSearchOnly}
                          color="warning"
                          size="small"
                          variant="outlined"
                          startIcon={<Iconify icon="mdi:close" />}
                          sx={{ minWidth: 'auto' }}
                        >
                          Search
                        </Button>
                      </Tooltip>
                    )}
                    
                    {(searchKey?.length > 0 || selectedFilters.length > 0) && (
                      <Tooltip title="Clear all">
                        <Button
                          onClick={clearAll}
                          color="error"
                          size="small"
                          variant="outlined"
                          startIcon={<Iconify icon="mdi:trash-can-outline" />}
                          sx={{ minWidth: 'auto', px: 1 }}
                        >
                          All
                        </Button>
                      </Tooltip>
                    )}

                    <Divider orientation="vertical" flexItem sx={{my: 0.5}} />
                    <FormControl size={size}>
                      <Select
                        multiple
                        value={selectedFilters}
                        onChange={handleFilterChange}
                        displayEmpty
                        size={size}
                        disabled={disabled}
                        renderValue={renderSelectedFilters}
                        sx={{
                          minWidth: isMobile ? 150 : 220,
                          '& .MuiOutlinedInput-notchedOutline': { 
                            border: 'none',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': { 
                            border: 'none',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                          '& .MuiSelect-select': {
                            color: selectedFilters.length === 0 ? 'text.secondary' : 'text.primary',
                            display: 'flex',
                            alignItems: 'center',
                          },
                          transition: 'all 0.2s ease',
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              marginTop: 1,
                              maxHeight: 300,
                              overflowY: 'auto',
                              '& .MuiMenuItem-root': {
                                transition: 'background-color 0.1s ease',
                              },
                            },
                          },
                        }}
                      >
                        <MenuItem disabled sx={{ 
                          justifyContent: 'space-between',
                          fontWeight: 'bold',
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          mb: 0.5,
                        }}>
                          <Typography variant="caption">
                            Select Columns
                          </Typography>
                          <Typography variant="caption" color="primary">
                            {selectedFilters.length}
                            {maxSelections && `/${maxSelections}`}
                          </Typography>
                        </MenuItem>

                        {filterOptions.map((option) => (
                          <MenuItem {...getMenuItemProps(option)}>
                            <Checkbox 
                              checked={selectedFilters.includes(option.id)}
                              size="small"
                              color="primary"
                            />
                            <ListItemText 
                              primary={option.fullLabel || option.label}
                              secondary={option.description}
                            />
                          </MenuItem>
                        ))}
                        
                        {filterOptions.length === 0 && (
                          <MenuItem disabled>
                            <Typography variant="body2" color="text.secondary">
                              No filter options available
                            </Typography>
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Stack>
                </InputAdornment>
              ),
            }}
          />

          <Collapse in={showMaxSelectionWarning}>
            <Alert severity="warning" size="small">
              Maximum {maxSelections} column{maxSelections !== 1 ? 's' : ''} can be selected
            </Alert>
          </Collapse>
          
          {/* Selected filters chips */}
          {showChips && selectedFilters.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 0.5,
              maxHeight: 100,
              overflowY: 'auto',
              bgcolor: 'background.paper',
            }}>
              {selectedFilterOptions.map((option) => (
                <Chip
                  key={option.id}
                  label={option.label}
                  size="small"
                  onDelete={() => removeFilter(option.id)}
                  color="primary"
                  variant="outlined"
                  sx={{
                    '& .MuiChip-deleteIcon': {
                      '&:hover': {
                        color: 'error.main',
                      },
                    },
                  }}
                />
              ))}
              
              {selectedFilters.length > 1 && (
                <Chip
                  label="Clear All"
                  size="small"
                  onClick={() => {
                    setSelectedFilters([]);
                    setValue(name, '');
                    afterClearHandler();
                  }}
                  color="error"
                  variant="outlined"
                  icon={<Iconify icon="mdi:trash-can-outline" />}
                />
              )}
            </Box>
          )}

          <Box sx={{ minHeight: '20px' }}>
            {(fieldError || error || helperText) && (
              <Typography variant="caption" color="text.disabled" sx={{ ml: 1 }}>
                {fieldError ? fieldError.message : error || helperText}
              </Typography>
            )}
            
            {maxSelections && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, display: 'block' }}>
                {selectedFilters.length}/{maxSelections} columns selected
              </Typography>
            )}
          </Box>
        </Stack>
      )}
    />
  );
}