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
        p: 2, 
        mb: 2, 
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'background.neutral',
        },
      }}
      onClick={onClick}
    >
        <Stack sx={{ width: '100%', px: { xs: 1, sm: 2 }}} spacing={2}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
            justifyContent: 'space-between' 
          }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Name:
              </Typography>
              <Typography variant="subtitle2" sx={{ wordBreak: 'break-word' }}>
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
          
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Value:
            </Typography>
            <Typography 
              variant="body2" 
              onClick={handleValueClick}
              sx={{ 
                bgcolor: 'background.neutral',
                p: 1.5,
                borderRadius: 1,
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                overflowX: 'auto',
                cursor: 'text',
                userSelect: 'text'
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
              alignItems: { xs: 'flex-start', sm: 'center' }
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  wordBreak: 'break-word',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                Created by {createdBy?.name} • {fDateTime(createdAt)}
              </Typography>
              <Box 
                component="span" 
                sx={{ 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  bgcolor: 'text.disabled',
                  display: { xs: 'none', sm: 'block' }
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
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