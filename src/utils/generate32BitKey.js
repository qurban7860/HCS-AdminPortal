export default async function generate32BitSecureKey(inputString) {
  // Convert input string to bytes
  const encoder = new TextEncoder();
  const inputData = encoder.encode(inputString);
  
  // Get cryptographically secure random values
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  
  // Combine input data with random bytes
  const combinedData = new Uint8Array([...inputData, ...randomBytes]);
  
  // Use SHA-256 for hashing
  const hashBuffer = await crypto.subtle.digest('SHA-256', combinedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // Define the character set for the key
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  // Convert hash to alphanumeric string with dashes
  // We'll generate 34 characters (32 + 2 dashes)
  let key = '';
  let charCount = 0;
  
  for (let i = 0; i < 34; i += 1) {
      // Insert dashes at positions 8 and 17
      if (i === 8 || i === 17) {
          key += '-';
      } else {
          // Use modulo to map hash values to alphanumeric characters
          const index = hashArray[charCount] % alphanumeric.length;
          key += alphanumeric[index];
          charCount += 1;
      }
  }
  
  return key;
}