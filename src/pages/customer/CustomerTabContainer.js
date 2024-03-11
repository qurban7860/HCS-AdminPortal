import PropTypes from 'prop-types';
import {  useNavigate } from 'react-router-dom';
// @mui
import { Tab, Container, Box, tabsClasses } from '@mui/material';
import TabContainer from '../../components/Tabs/TabContainer';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// components
import UnderDevelopment from '../boundaries/UnderDevelopment';
// sections
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import Iconify from '../../components/iconify';
import  TABS from './index';
import { PATH_CUSTOMER } from '../../routes/paths';

// ----------------------------------------------------------------------

CustomerTabContainer.propTypes = {
  currentTabValue: PropTypes.string,
};

export default function CustomerTabContainer({ currentTabValue }) {
  // const { id } = useParams();
  const { customer } = useSelector((state) => state.customer);
  const navigate = useNavigate();
  const navigatePage = (tab)=>{
    if(tab === 'customer'){
      navigate( PATH_CUSTOMER.view(customer?._id))
    } else if(tab === 'sites'){
      navigate( PATH_CUSTOMER.site.root(customer?._id) )
    } else if(tab === 'contacts'){
      navigate( PATH_CUSTOMER.contact.root(customer?._id) )
    } else if(tab === 'notes' && customer?._id ){
      navigate( PATH_CUSTOMER.notes.root(customer?._id) )
    } else if(tab === 'documents' && customer?._id){
      navigate( PATH_CUSTOMER.documents.root(customer?._id) )
    } else if(tab === 'machines' && customer?._id ){
      navigate( PATH_CUSTOMER.machines.root(customer?._id) )
    } 
  }
  return (
      <StyledCardContainer>
        <Cover name={customer ? customer.name : 'New Customer'} avatar />
        <TabContainer
          tabsClasses={tabsClasses.scrollButtons}
          currentTab={currentTabValue}
          setCurrentTab={(tab)=>  navigatePage(tab) }
        >
          {TABS.map((tab) => (
            <Tab
              disabled={tab.disabled}
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </TabContainer>
      </StyledCardContainer>
  );
}
