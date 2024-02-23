
import { format } from 'date-fns';
import axios from './axios';
import { CONFIG } from '../config-global';

export function exportCSV(fileName, customerId) {
    return async (dispatch) => {
      try {
        let api
        if(fileName?.toLowerCase() === 'customersites'){
          api = `crm/customers/${customerId}/sites/export`
        } else if( fileName?.toLowerCase() === 'allsites' ){
          api = 'crm/customers/undefined/sites/export';
        }else if( fileName?.toLowerCase() === 'allcontacts' ){
          api = 'crm/customers/undefined/contacts/export';
        }else if( fileName?.toLowerCase() === 'machines' ){
          api = 'products/machines/export';
        }else if( fileName?.toLowerCase() === 'customercontacts' ){
          api = `crm/customers/${customerId}/contacts/export`;
        }else if( fileName?.toLowerCase() === 'customers' ){
          api = 'crm/customers/export/';
        }
        const response = await axios.get(`${CONFIG.SERVER_URL}${api}`);
        // Converting JSON to CSV String
        const csvData = convertJsonToCsv(response.data);
        // Blob Created
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        // Download link Create
        const downloadLink = document.createElement('a');
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        // Date Time Stamp Created
        const dateTimeStamp = format(Date.now(), 'yyyyMMddHHmmss');
        // Triggered the download action on click 
        downloadLink.setAttribute('download', `${fileName}-${dateTimeStamp}.csv`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        return {message:"CSV Generated Successfully",  hasError:false};
      } catch (error) {
        console.log(error);
        return {message:`CSV Generation Failed ${error}`, hasError:true};
      }
    };
  }

  export const convertJsonToCsv = (json) => {
    const header = Object.keys(json[0]).join(',');
    const rows = json.map((row) => {
      const values = Object.values(row).map(value => {
        if (value && value.toString().includes(',')) {
          return `"${value}"`;
        }
        return value;
      });
      return values.join(',');
    });
    return `${header}\n${rows.join('\n')}`;
  };