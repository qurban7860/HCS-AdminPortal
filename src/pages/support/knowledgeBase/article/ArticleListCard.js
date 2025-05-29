import PropTypes from 'prop-types';
// @mui
import {
  Card,
  CardHeader,
  Grid,
  useTheme,
} from '@mui/material';
import CardActions from '@mui/material/CardActions';
// utils
import { fDate } from '../../../../utils/formatTime';
import { ICONS } from '../../../../constants/icons/default-icons';
import ArticleInfo from './ArticleInfo';
import { PATH_SUPPORT } from '../../../../routes/paths';
import OpenInNewPage from '../../../../components/Icons/OpenInNewPage';
// ----------------------------------------------------------------------

ArticleListCard.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  prefix: PropTypes.string,
};


export default function ArticleListCard({
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
  

  const theme = useTheme();

  const renderAritcle = (
    <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: theme.customShadows.z24 } }} onClick={onViewRow}>
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
  );

  return (renderAritcle);
}
