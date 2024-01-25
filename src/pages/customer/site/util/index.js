import { regExp } from '../../../../components/RegularExpression/regularExpression'

export { default as SiteCover } from './SiteCover';

export function isNumberString(str) {
    return regExp.numberCheckRegex.test(str.trim());
}

export function isNumberLatitude(str) {
    if(!(isNumberString(str))){
    return false;
}
    return regExp.latitudeRegex.test(str.trim());
}

export function isNumberLongitude(str) {
    if(!(isNumberString(str))){
        return false;
    }
    return regExp.longitudeRegex.test(str.trim());
}

export function checkValuesNotNull(obj) {
    return Object.values(obj).some(value => value !== null);
  }