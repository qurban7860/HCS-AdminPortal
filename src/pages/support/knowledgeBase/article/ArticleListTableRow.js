import PropTypes from 'prop-types';
// @mui
import {
  Button,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  TableCell,
  Typography,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../../theme/styles/default-styles'
import { useBoolean } from '../../../../hooks/useBoolean';
import Iconify from '../../../../components/iconify';
import IconTooltip from '../../../../components/Icons/IconTooltip';
import { ICONS } from '../../../../constants/icons/default-icons';
import ArticleInfo from './ArticleInfo';

// ----------------------------------------------------------------------

ArticleListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  prefix: PropTypes.string,
};


export default function ArticleListTableRow({
  row,
  style,
  selected,
  onViewRow,
  prefix,
}) {
  const { articleNo, title, description, status, category, customerAccess, isActive, updatedAt } = row;

  const renderPrimary = (
    <StyledTableRow hover selected={selected}>
      <LinkTableCell onClick={onViewRow} param={`${prefix}-${articleNo}`} />
      <TableCell>{title}</TableCell>
      <TableCell>{category?.name}</TableCell>
      <TableCell>{status}</TableCell>
      <TableCell><Switch checked={customerAccess} disabled size="small" /></TableCell>
      <TableCell><Switch checked={isActive} disabled size="small" /></TableCell>
      <TableCell align="right">{fDate(updatedAt)}</TableCell>
    </StyledTableRow>
  );

  const renderAritcle = (
    <StyledTableRow hover selected={selected} onClick={onViewRow}>
      <TableCell colSpan={7} sx={{ pl:1.5 }}>
        <Typography 
          variant="subtitle2"
          sx={{
            pl: '5px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          }}
        >
          {title}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="space-between">
            <Stack direction="row" spacing={1}>
              <ArticleInfo label={`${prefix}-${articleNo} (${category?.name})`} />
              <ArticleInfo label={status} />
              <ArticleInfo icon={customerAccess ? ICONS.ALLOWED.icon : ICONS.DISALLOWED.icon} tooltip={customerAccess ? 'Customer Access Allowed' : 'Customer Access Disallowed'} />
              <ArticleInfo icon={isActive ? ICONS.ACTIVE.icon : ICONS.INACTIVE.icon} tooltip={isActive ? 'Active' : 'Inactive'} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <ArticleInfo icon='mdi:clock-outline' label={fDate(updatedAt)} tooltip='Updated At' />
            </Stack>
        </Stack>
      </TableCell>
    </StyledTableRow>
  );

  return (renderAritcle);
}
