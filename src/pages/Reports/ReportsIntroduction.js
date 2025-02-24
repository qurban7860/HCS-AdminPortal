import { Card, Grid, List, ListItem, ListItemText, Stack, Typography, useTheme, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { StyledContainer } from '../../theme/styles/default-styles';
import { TITLES } from '../../constants/default-constants';
import Iconify from '../../components/iconify';
import NavigationConfig from '../../layouts/dashboard/nav/NavigationConfig';
import { useAuthContext } from '../../auth/useAuthContext';

const ReportsIntroduction = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const selectedCategory = {
    id: 'reports',
    name: 'Reports'
  };
  const {
    isDocumentAccessAllowed,
    isDrawingAccessAllowed,
    isSettingAccessAllowed,
    isSecurityUserAccessAllowed,
  } = useAuthContext();

  const reportsItems = NavigationConfig({
    selectedCategory,
    isDocumentAccessAllowed,
    isDrawingAccessAllowed,
    isSettingAccessAllowed,
    isSecurityUserAccessAllowed,
    requireDashboard: false,
  });

  return (
    <StyledContainer maxWidth={false}>
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12}>
          <Stack flexGrow={1} sx={{textAlign: { xs: 'center', md: 'left' }, mb:{ md:5 }, mt:{ xs:0, md:5 }, color: theme.palette.primary.darker}}>
            <Typography variant="h1">{TITLES.REPORTS_TITLE}</Typography>
            <Typography variant="body1" sx={{opacity: 0.8}}>
              Welcome to the Reports section. Here you can view and analyze your data through various reports.
            </Typography>
          </Stack>
        </Grid>

        {reportsItems.map((category) => (
          <React.Fragment key={category.subheader}>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ color: theme.palette.primary.darker, mt: 3, mb: 2 }}>
                {category.subheader}
              </Typography>
            </Grid>
            {category.items.map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item.title}>
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: theme.shadows[10]
                    }
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {React.cloneElement(item.icon, { width: 40, height: 40, sx: { color: theme.palette.primary.main } })}
                    <Typography variant="h6" sx={{ ml: 2 }}>
                      {item.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ flexGrow: 1, color: 'text.secondary' }}>
                    {item.description}
                  </Typography>
                  
                  {item.children && (
                    <Box sx={{ mt: 2 }}>
                      <List dense>
                        {item.children.map((child) => (
                          <ListItem 
                            key={child.title}
                            sx={{ 
                              p: 1, 
                              '&:hover': { 
                                bgcolor: 'action.hover',
                                borderRadius: 1
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(child.path);
                            }}
                          >
                            {React.cloneElement(child.icon, { width: 20, height: 20 })}
                            <ListItemText 
                              primary={child.title} 
                              sx={{ ml: 1 }}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      View Reports
                      <Iconify icon="mdi:arrow-right" width={20} height={20} sx={{ ml: 1 }} />
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </React.Fragment>
        ))}
      </Grid>
    </StyledContainer>
  );
};

export default ReportsIntroduction;
