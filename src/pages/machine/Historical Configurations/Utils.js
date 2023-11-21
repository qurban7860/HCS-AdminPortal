import PrintArray from "./PrintArray";
import PrintObject from "./PrintObject";

export const getColorForType = (value) => {
    if (typeof value === 'string') {
      return 'blue'; // Color for string values
    } 
    if(typeof value === 'number') {
      return 'green'; // Color for number values
    } 
    if(typeof value === 'boolean') {
      return 'red'; // Color for boolean values
    } 
      return 'black'; // Default color for other types
  };
  
  
  export const printValue = (value, depth) => {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return PrintArray(value, depth);
      } 
        return PrintObject(value, depth);
    } 
      return <span style={{ color: getColorForType(value) }}>{JSON.stringify(value)}</span>;
  };