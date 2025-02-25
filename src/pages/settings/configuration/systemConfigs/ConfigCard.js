import PropTypes from 'prop-types';
import {
  Paper,
  Switch,
  Stack,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router';

import { fDateTime } from '../../../../utils/formatTime';
import IconTooltip from '../../../../components/Icons/IconTooltip';
import { PATH_SETTING } from '../../../../routes/paths';

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

  return (
    <Paper
      id={_id}
      sx={{
        p: 2.5,
        borderRadius: 2,
        boxShadow: theme.customShadows.card,
        transition: () =>
          theme.transitions.create(['box-shadow', 'transform', 'background-color'], {
            duration: theme.transitions.duration.standard,
          }),
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.customShadows.z24,
          bgcolor: 'background.paper',
          '& .value-container': {
            bgcolor: 'background.neutral',
          },
        },
      }}
    >
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1.5, sm: 0 },
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="h6"
              sx={{
                wordBreak: 'break-word',
                color: 'text.primary',
                pl: 1,
                fontWeight: 600,
              }}
            >
              {name}
            </Typography>
          </Stack>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2 }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Type: {type}
            </Typography>
            <Stack direction="row" alignItems="center">
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Active:
              </Typography>
              <Switch checked={isActive} disabled size="small" />
            </Stack>
          </Stack>
        </Box>

        <Stack spacing={1}>
          <Typography
            variant="body2"
            className="value-container"
            sx={{
              bgcolor: theme.palette.background.neutral,
              p: 2,
              borderRadius: 1.5,
              wordBreak: 'break-all',
              fontFamily: 'monospace',
              overflowX: 'auto',
              cursor: 'text',
              userSelect: 'text',
              transition: () =>
                theme.transitions.create('background-color', {
                  duration: theme.transitions.duration.shorter,
                }),
            }}
          >
            {value}
          </Typography>
          {notes && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                pl: 1,
              }}
            >
              Note: {notes}
            </Typography>
          )}
        </Stack>
        <Stack spacing={1}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { sm: 'row' },
              gap: 1,
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: { sm: 'space-between' },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'text.disabled',
                wordBreak: 'break-word',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                pl: 1,
                fontStyle: 'italic',
              }}
            >
              Created by {createdBy?.name} • {fDateTime(createdAt)} &nbsp; | &nbsp; Last updated by{' '}
              {updatedBy?.name} • {fDateTime(updatedAt)}
            </Typography>
            <IconTooltip
              title="Edit"
              onClick={() => handleEdit(_id)}
              color={theme.palette.primary.main}
              icon="mdi:square-edit-outline"
              iconSx={{ 
                border: 'none'
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
} 