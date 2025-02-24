import PropTypes from 'prop-types';
import {
  Paper,
  Switch,
  Stack,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { fDateTime } from '../../../../utils/formatTime';
import { CustomAvatar } from '../../../../components/custom-avatar';

ConfigCard.propTypes = {
  config: PropTypes.object,
  onClick: PropTypes.func,
};

export default function ConfigCard({ config, onClick }) {
  const { name, type, value, updatedBy, updatedAt, createdBy, createdAt, isActive } = config;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleValueClick = (event) => {
    event.stopPropagation();
  };

  return (
    <Paper 
      sx={{ 
        p: 2.5,
        cursor: 'pointer',
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
          }
        },
      }}
      onClick={onClick}
    >
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1.5, sm: 0 },
            justifyContent: 'space-between' 
          }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Name:
              </Typography>
              <Typography variant="subtitle2" sx={{ wordBreak: 'break-word', color: 'text.primary', fontWeight: 600 }}>
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
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Status:
                </Typography>
                <Switch checked={isActive} disabled size="small" />
              </Stack>
            </Stack>
          </Box>
          
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Value:
            </Typography>
            <Typography 
              variant="body2" 
              onClick={handleValueClick}
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
          </Stack>
          <Stack spacing={1}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1,
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: { sm: 'space-between' }
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.disabled',
                  wordBreak: 'break-word',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                Created by {createdBy?.name} • {fDateTime(createdAt)}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.disabled',
                  wordBreak: 'break-word',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                Last updated by {updatedBy?.name} • {fDateTime(updatedAt)}
              </Typography>
            </Box>
          </Stack>
        </Stack>
    </Paper>
  );
} 