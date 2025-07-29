import PropTypes from 'prop-types';
import {
  Stack,
  Typography,
  useTheme,
  Card,
  CardHeader,
  CardContent,
  CardActions
} from '@mui/material';
import { useNavigate } from 'react-router';

import { fDateTime } from '../../../../utils/formatTime';
import IconTooltip from '../../../../components/Icons/IconTooltip';
import { PATH_SETTING } from '../../../../routes/paths';
import { ICONS } from '../../../../constants/icons/default-icons';

ConfigCard.propTypes = {
  config: PropTypes.object,
  onClick: PropTypes.func,
};

export default function ConfigCard({ config, onClick }) {
  const { name, type, value, updatedBy, updatedAt, createdBy, createdAt, isActive, notes, _id } = config;
  const theme = useTheme();
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(PATH_SETTING.configs.edit(id))
  }

  const renderCard = (
    <Card sx={{mt: 2, '&:hover': { boxShadow: theme.customShadows.z24 }}}>
      <CardHeader 
        title={name || ''}
        sx={{pt:1.5}}
        action={
          <>
            <IconTooltip  title={type} icon='mdi:info' iconSx={{ border: 'none' }} />
            <IconTooltip 
              title={isActive ? ICONS.ACTIVE.heading : ICONS.INACTIVE.heading} 
              color={isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color}
              icon={isActive ? ICONS.ACTIVE.icon : ICONS.INACTIVE.icon}
              iconSx={{ border: 'none' }}
            />
            <IconTooltip
              title="Edit"
              onClick={() => handleEdit(_id)}
              color={theme.palette.primary.main}
              icon="mynaui:edit-one-solid"
              iconSx={{ 
                border: 'none'
              }}
            />
          </> 
        }
      />
      <CardContent sx={{ px:2, py:1, pb:0 }}>
        <Typography variant="body2" sx={{ p: 2, borderRadius: 1.5, backgroundColor: 'background.neutral', fontFamily: 'monospace' }}>{value}</Typography>
        {notes && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1, pb:0 }}>
            Note: {notes}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ px: 3, pt:0 }}>
        <Stack spacing={2} direction="row" justifyContent="space-between" sx={{width: '100%'}}>
          <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.disabled' }}>Created by {createdBy?.name} • {fDateTime(createdAt)} </Typography>
          <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.disabled' }}>Last updated by {updatedBy?.name} • {fDateTime(updatedAt)}</Typography>
        </Stack>
      </CardActions>
    </Card>
  )

  return (<>
    {/* {renderPaper} */}
    {renderCard}
    </>);
} 