import PropTypes from 'prop-types';
// @mui
import {
  Button,
  Card,
  CardHeader,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CardActions from '@mui/material/CardActions';
// utils
import { fDate } from '../../../../utils/formatTime';
import { ICONS } from '../../../../constants/icons/default-icons';
import { PATH_SUPPORT } from '../../../../routes/paths';
import OpenInNewPage from '../../../../components/Icons/OpenInNewPage';
import IconTooltip from '../../../../components/Icons/IconTooltip';
import { articleStatusOptions } from '../../../../utils/constants';
import Iconify from '../../../../components/iconify';
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

  const statusOption = articleStatusOptions.find((option) => option.value === status);
    

  const renderAritcle = (
    <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: theme.customShadows.z24 } }} onClick={onViewRow}>
      <CardHeader sx={{ pt: 1, px: 2 }} 
          title={<>
                  {title}
                  <IconTooltip title='Open in New Tab' icon='fluent:open-12-regular' onClick={handleExternalLink} iconSx={{ border: 'none', width: '30px' }} />
              </>} 
          action={
            <>
              <IconTooltip 
                title={statusOption?.label} 
                icon={statusOption?.icon} 
                color={statusOption?.color} 
                onClick={(event) => event.stopPropagation()} 
                iconSx={{ border: 'none' }} 
              />
              <IconTooltip 
                onClick={(event) => event.stopPropagation()}
                title={customerAccess ? ICONS.ALLOWED.heading : ICONS.DISALLOWED.heading} 
                color={customerAccess ? ICONS.ALLOWED.color : ICONS.DISALLOWED.color}
                icon={customerAccess ? ICONS.ALLOWED.icon : ICONS.DISALLOWED.icon}
                iconSx={{ border: 'none' }}
              />
              <IconTooltip
                onClick={(event) => event.stopPropagation()}
                title={isActive ? ICONS.ACTIVE.heading : ICONS.INACTIVE.heading} 
                color={isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color}
                icon={isActive ? ICONS.ACTIVE.icon : ICONS.INACTIVE.icon}
                iconSx={{ border: 'none' }}
              />
            </>
          }
          />
      <CardActions sx={{ px: 2, pt:0 }}>
        <Stack direction="row" spacing={2} justifyContent="space-between" width="100%">
          <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.disabled' }}>{`${prefix}-${articleNo} (${category?.name})`}</Typography>
          <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.disabled' }}>Updated At: {fDate(updatedAt)}</Typography>
        </Stack>
      </CardActions>
    </Card>
  );

  

  return (renderAritcle);
}
