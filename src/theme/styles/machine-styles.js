import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

// @root - Machine - settings
export const StyledSettingsCardContainer = styled(Card)(({ theme }) => ({
  margin: '1rem 0',
  padding: '1rem 0',
  color: theme.palette.text.disabled,
}));
