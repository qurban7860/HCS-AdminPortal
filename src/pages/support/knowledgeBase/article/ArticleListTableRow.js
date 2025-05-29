import PropTypes from 'prop-types';
// @mui
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import CardActions from '@mui/material/CardActions';
// utils
import { fDate } from '../../../../utils/formatTime';
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import { useBoolean } from '../../../../hooks/useBoolean';
import Iconify from '../../../../components/iconify';
import IconTooltip from '../../../../components/Icons/IconTooltip';
import { ICONS } from '../../../../constants/icons/default-icons';
import ArticleInfo from './ArticleInfo';
import { StyledTooltip } from '../../../../theme/styles/default-styles';
import { PATH_SUPPORT } from '../../../../routes/paths';
import OpenInNewPage from '../../../../components/Icons/OpenInNewPage';
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
  const { _id, articleNo, title, description, status, category, customerAccess, isActive, updatedAt } = row;

  const handleExternalLink = (event) => {
    event.stopPropagation(); 
    const url = PATH_SUPPORT.knowledgeBase.article.view(_id);
    window.open(url, '_blank');
  };
  
  // const renderPrimary = (
  //   <StyledTableRow hover selected={selected}>
  //     <LinkTableCell onClick={onViewRow} param={`${prefix}-${articleNo}`} />
  //     <TableCell>{title}</TableCell>
  //     <TableCell>{category?.name}</TableCell>
  //     <TableCell>{status}</TableCell>
  //     <TableCell><Switch checked={customerAccess} disabled size="small" /></TableCell>
  //     <TableCell><Switch checked={isActive} disabled size="small" /></TableCell>
  //     <TableCell align="right">{fDate(updatedAt)}</TableCell>
  //   </StyledTableRow>
  // );

  const renderAritcle = (
    <TableRow selected={selected} onClick={onViewRow} sx={{cursor:'pointer'}}>
      <TableCell colSpan={7}>
        <Card sx={{ '&:hover': { backgroundColor: 'background.neutral' } }}>
          <CardHeader sx={{ pt: 1, px: 2 }} 
              title={<>{title}<OpenInNewPage onClick={handleExternalLink} /></>} 
              />
            <CardActions sx={{ pt: 1, px: 2 }}>
            <Grid container spacing={2} direction="row" justifyContent="space-between">
              <Grid item display="flex" gap={1}>
                <ArticleInfo label={`${prefix}-${articleNo} (${category?.name})`} />
                <ArticleInfo label={status} />
                <ArticleInfo color={customerAccess ? ICONS.ALLOWED.color : ICONS.DISALLOWED.color} icon={customerAccess ? ICONS.ALLOWED.icon : ICONS.DISALLOWED.icon} tooltip={customerAccess ? ICONS.ALLOWED.heading : ICONS.DISALLOWED.heading} />
                <ArticleInfo color={isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color} icon={isActive ? ICONS.ACTIVE.icon : ICONS.INACTIVE.icon} tooltip={isActive ? ICONS.ACTIVE.heading : ICONS.INACTIVE.heading} />
              </Grid>
              <Grid item display="flex" gap={1}>
                <ArticleInfo icon='mdi:clock-outline' label={fDate(updatedAt)} tooltip='Updated At' />
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </TableCell>
    </TableRow>
  );

  return (renderAritcle);
}
