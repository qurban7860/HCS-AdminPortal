
import { format } from 'date-fns';
import axios from './axios';
import { CONFIG } from '../config-global';

export function exportCSV(fileName, api, params) {
    return async (dispatch) => {
      try {
        const response = await axios.get(`${CONFIG.SERVER_URL}${api}`, {params});
        
        // Step 1: Convert JSON to CSV String
        const csvData = convertJsonToCsv(response.data);

        // Step 2: Create a Blob
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

        // Step 3: Create a download link
        const downloadLink = document.createElement('a');
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;

        const timestamp = format(Date.now(), 'yyyyMMddHHmmss');

        // Step 4: Simulate a click to trigger the download
        downloadLink.setAttribute('download', `${fileName}_${timestamp}.csv`);
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
        // If the value contains a comma, enclose it in double quotes
        if (value && value.toString().includes(',')) {
          return `"${value}"`;
        }
        return value;
      });
      return values.join(',');
    });
    return `${header}\n${rows.join('\n')}`;
  };