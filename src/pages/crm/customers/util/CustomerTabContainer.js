import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Tab, tabsClasses } from '@mui/material';
import TabContainer from '../../../../components/Tabs/TabContainer';
// redux
import { useSelector } from '../../../../redux/store';
// sections
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import  TABS from '../index';
import { PATH_CRM } from '../../../../routes/paths';

// ----------------------------------------------------------------------

CustomerTabContainer.propTypes = {
  currentTabValue: PropTypes.string,
};

export default function CustomerTabContainer({ currentTabValue }) {

  const { customer } = useSelector((state) => state.customer);
  
  const { customerId } = useParams();
  const navigate = useNavigate();
  const navigatePage = (tab)=>{
    if(tab === 'customer' && customerId ){
      navigate( PATH_CRM.customers.view(customerId))
    } else if(tab === 'sites' && customerId ){
      navigate( PATH_CRM.customers.sites.root(customerId) )
    } else if(tab === 'contacts' && customerId ){
      navigate( PATH_CRM.customers.contacts.root(customerId) )
    } else if(tab === 'notes'  && customerId  ){
      navigate( PATH_CRM.customers.notes.root(customerId) )
    } else if(tab === 'documents' && customerId ){
      navigate( PATH_CRM.customers.documents.root(customerId) )
    } else if(tab === 'machines' && customerId  ){
      navigate( PATH_CRM.customers.machines.root(customerId) )
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
