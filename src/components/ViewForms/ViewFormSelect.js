import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import Iconify from '../iconify';
import SkeletonViewFormField from '../skeleton/SkeletonViewFormField';

export default function ViewFormSelect({ isLoading=false, value, onChange, options, disabled, sx }) {

  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    onChange?.(e);
  };

    return isLoading ? (
      <SkeletonViewFormField />
    ) : (
    <Select sx={{ ...sx, '& .MuiSelect-select': { display: 'flex', paddingTop: '10px' } }}
      size="small"
      value={selectedValue}
      onChange={handleChange}
      variant="filled"
      disabled={disabled}
    >
      {options.map((option) => (
        <MenuItem
          key={option?.value}
          value={option?.value}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {option?.icon && <Iconify color={option?.color} icon={option?.icon} width="20px" sx={{ mr: 1 }} />}
          {option?.label}
        </MenuItem>
      ))}
    </Select>
    )
}

ViewFormSelect.propTypes = {
  isLoading: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};