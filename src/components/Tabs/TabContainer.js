import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from '@mui/material';
import { useTheme } from '@emotion/react';

TabContainer.propTypes = {
  currentTab: PropTypes.string,
  setCurrentTab: PropTypes.func,
  children: PropTypes.node,
  tabsClasses: PropTypes.string,
};

function TabContainer({
  tabsClasses,
  currentTab = 0,
  setCurrentTab = () => {},
  children,
  ...other
}) {
  const theme = useTheme();
  const options = {
    value: currentTab,
    onChange: (event, newValue) => setCurrentTab(newValue),
    variant: 'scrollable',
    'aria-label': 'scrollable force tabs example',
    sx: {
      [`& .${tabsClasses.scrollButtons}`]: {
        '&.Mui-disabled': { opacity: 0.3 },
      },
      width: 1,
      bottom: 0,
      zIndex: 9,
      display:'flex',
      position: 'absolute',
      backgroundColor: theme.palette.background.paper,
      '& .MuiTabs-flexContainer': {
        pr: 2.5,
        pl: 2.5,
        ml:'auto',
        // justifyContent: 'flex-end' ,
      },
    },

  };

  return <Tabs 
  {...options}     
  variant="scrollable"
  scrollButtons="auto"
  aria-label="scrollable auto tabs example" 
  >{children}</Tabs>;
}

export default TabContainer;
