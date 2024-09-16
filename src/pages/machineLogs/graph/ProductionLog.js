import {React, memo } from 'react'
import { Grid, Container} from '@mui/material';
import { StyledBg, StyledCardContainer } from '../../../theme/styles/default-styles';
import ProductionGraph from '../../../components/Charts/ProductionLog';
import { Cover } from '../../../components/Defaults/Cover';

const ProductionLog = () => (
    <Container maxWidth={false}>
      <StyledCardContainer>
      <Cover name= "Production Logs" backLink coilLog erpLog productionLog/>
      </StyledCardContainer>
      <Grid item xs={12} md={6} lg={8} my={4}>
        <ProductionGraph machineLogs
          title="Production Log"
          chart={{
            categories: [
              '2:00:00PM',
              '2:30:00PM',
              '2:45:00PM',
              '4:00:00PM',
              '7:00:00AM',
              '10:05:00AM',
            ],
            series: [
              {
                day: '28-June-2023',
                data: [
                  { name: 'Operator 1', data: [5000, 0, 3000, 0, 2000, 0] },
                  { name: 'Operator 2', data: [5000, 0, 4000, 0, 3000, 0] },
                  { name: 'Operator 3', data: [5500, 0, 2500, 0, 1500, 0] },
                ],
              },
            ],
          }}
          sx={{ bg: 'transparent' }}
        />
        <StyledBg />
      </Grid>
    </Container>
  )

export default memo( ProductionLog)