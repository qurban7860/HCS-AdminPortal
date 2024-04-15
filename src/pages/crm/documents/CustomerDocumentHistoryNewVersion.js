import { Container } from '@mui/material';
import CustomerTabContainer from '../customers/util/CustomerTabContainer'
import DocumentAddForm from '../../documents/DocumentAddForm';
// ----------------------------------------------------------------------

export default function CustomerDocumentHistoryNewVersion() {

return (<Container maxWidth={false} >
            <CustomerTabContainer currentTabValue='documents' />
            <DocumentAddForm customerPage historyNewVersion />
        </Container> );
}
