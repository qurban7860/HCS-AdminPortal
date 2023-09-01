// @mui
import { Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';

// ----------------------------------------------------------------------
export default function BlankPage() {
  const { themeStretch } = useSettingsContext();

  return (
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h6"> Blank </Typography>
      </Container>
  );
}
