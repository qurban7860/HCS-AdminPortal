function camelCaseToNormalText(camelCaseString) {
  // Step 1: Add space before capital letters, but not if they're in a sequence
  const spaced = camelCaseString.replace(/([a-z])([A-Z])|([A-Z])([A-Z][a-z])/g, '$1$3 $2$4');
  
  // Step 2: Capitalize the first letter
  const capitalized = spaced.charAt(0).toUpperCase() + spaced.slice(1);
  
  // Step 3: Remove spaces between single capital letters
  return capitalized.replace(/\s+([A-Z])(?=[A-Z][a-z]|\d|\W|$)(?<!\s[A-Z])/g, '$1');
}


export { camelCaseToNormalText };