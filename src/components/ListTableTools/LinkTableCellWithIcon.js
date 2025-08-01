import PropTypes from 'prop-types';
import { useState } from 'react';
import { TableCell, Link } from '@mui/material';
import { alpha } from '@mui/material/styles';
import VerificationIcon from '../Icons/VerificationIcon';
import useLimitString from '../../hooks/useLimitString';
import { StyledTooltip } from '../../theme/styles/default-styles';

export default function LinkTableCellWithIcon({ align, onClick, param, isVerified, main }) {
  const limit = 25;
  return (
    <TableCell align={align}>
      <VerificationIcon isVerified={isVerified} />
      <StyledTooltip title={param.length>limit?param:''} placement="top">
        <Link onClick={onClick}
          color="inherit"
          sx={{
            cursor: 'pointer',
            textDecoration: 'underline',
            textDecorationStyle: 'dotted',
            fontWeight: 'bold',
            color: main ? (themes) => alpha(  themes.palette.primary.dark, 0.98) : 'black',
            '&:hover': {
              color: (theme) => alpha(theme.palette.mode === 'light' ? theme.palette.info.main : theme.palette.info.light, 0.98),
            },
          }}
        >
          { useLimitString( param, limit) }
        </Link>
      </StyledTooltip>
    </TableCell>
  );
}

LinkTableCellWithIcon.propTypes = {
  align: PropTypes.string,
  onClick: PropTypes.func,
  param: PropTypes.string,
  isVerified: PropTypes.bool,
  main: PropTypes.bool,
};
