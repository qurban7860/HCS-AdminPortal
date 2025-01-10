import { Box, Container, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

import Iconify from '../../components/iconify';
import { StyledContainer } from '../../theme/styles/default-styles';

const SectionUnderConstruction = () => {
  const theme = useTheme();

  return (
    <StyledContainer maxWidth={false}>
      <Container>
        <Box
          sx={{
            py: 12,
            maxWidth: 680,
            mx: 'auto',
            textAlign: 'center',
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Iconify
              icon="mdi:construction"
              width={120}
              height={120}
              sx={{ color: theme.palette.warning.main }}
            />

            <Typography variant="h3" sx={{ color: theme.palette.primary.darker }}>
              Section Under Construction
            </Typography>

            <Typography sx={{ color: 'text.secondary' }}>
              We&apos;re working hard to bring you something amazing. This section is currently being developed and will be available soon. Check back later for updates!
            </Typography>

            <Box
              component="img"
              src="/assets/illustrations/under_construction.svg"
              sx={{ height: 400, mx: 'auto' }}
            />
          </Stack>
        </Box>
      </Container>
    </StyledContainer>
  );
};

export default SectionUnderConstruction;
