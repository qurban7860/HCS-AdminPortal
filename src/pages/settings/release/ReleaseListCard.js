import PropTypes from 'prop-types';
// @mui
import { Box, Typography, Link, TableCell } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
// components
import { StyledTableRow, StyledTooltip } from '../../../theme/styles/default-styles';
import { ICONS } from '../../../constants/icons/default-icons';
import Iconify from '../../../components/iconify';
import Editor from '../../../components/editor';
import { releaseStatusOptions } from '../../../utils/constants';

export default function ReleaseListCard({ row, onViewRow, selected }) {
  const { name, project, status, releaseDate, description } = row;
  const statusOption = releaseStatusOptions.find((opt) => opt.value === status);

  return (
    <StyledTableRow hover selected={selected} style={{ display: 'block' }}>
      <TableCell
        align="left"
        sx={{
          display: { sm: 'block', md: 'flex' },
          justifyContent: 'space-between',
          pt: 1,
          mb: -1,
        }}
      >
        <b>
          Version:{' '}
          <Link onClick={onViewRow} sx={{ cursor: 'pointer' }}>
            {`${name}`}
          </Link>
          <StyledTooltip placement="top" disableFocusListener color={ICONS.RELEASE.color} title={ICONS.RELEASE.heading} tooltipcolor={ICONS.RELEASE.color}>
            <Iconify icon={ICONS.RELEASE.icon} sx={{ ml: 1.5, height: 20, width: 20 }} />
          </StyledTooltip>
          {project?.name && (
            <Typography variant="body2" sx={{ ml: 0.5, color: 'text.secondary', fontWeight: 'bold', display: 'inline' }}>
             {project.name}
            </Typography>
          )}
        </b>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          {statusOption && (
            <StyledTooltip placement="top" title={status || ''} tooltipcolor={statusOption.color}>
              <Iconify icon={statusOption.icon} color={statusOption.color} sx={{ mr: 1 }} />
            </StyledTooltip>
          )}
          {releaseDate && (
            <Typography variant="body2">
              <b>Release Date: </b>
              {fDate(releaseDate)}{' '}
            </Typography>
          )}
        </Box>
      </TableCell>

      {description && (
        <TableCell align="left" sx={{ pb: 1 }}>
          <Typography
            variant="body2"
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
            }}
          >
            <StyledTooltip placement="top" disableFocusListener color={ICONS.NOTE.color} title={ICONS.NOTE.heading} tooltipcolor={ICONS.NOTE.color}>
              <Iconify icon={ICONS.NOTE.icon} sx={{ mx: 0.3, flexShrink: 0, width: '20px', height: '20px' }} />
            </StyledTooltip>
            <Editor readOnly hideToolbar value={description} sx={{ border: 'none', '& .ql-editor': { padding: 0 } }} />
          </Typography>
        </TableCell>
      )}
    </StyledTableRow>
  );
}

ReleaseListCard.propTypes = {
  row: PropTypes.object.isRequired,
  onViewRow: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};
