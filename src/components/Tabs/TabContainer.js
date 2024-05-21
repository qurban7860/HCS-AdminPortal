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
      '& .MuiTabs-scrollButtons': {
        backgroundColor: '#426fcd', // Change background color
        borderRadius: '15px', // Make the buttons circular
        color:'#fff',
        width:'20px',
        '&:hover': {
          backgroundColor: 'blue', // Change background color on hover
        },
      },
      '& .MuiButtonBase-root':{
        marginRight:'0px !important',
      },
      '& .MuiIconButton-root':{
        mr:'5px  !important'
      },
      '& .Mui-selected':{
        pr:1,
      }
    },

  };

  return <Tabs variant="scrollable" scrollButtons  {...options}>
          {children}
         </Tabs>;
}

export default TabContainer;
