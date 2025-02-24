export default async function generate64BitSecureKey(inputString) {
  // Convert input string to bytes
  const encoder = new TextEncoder();
  const inputData = encoder.encode(inputString);
  
  // Get cryptographically secure random values
  const randomBytes = new Uint8Array(64);
  crypto.getRandomValues(randomBytes);
  
  // Combine input data with random bytes
  const combinedData = new Uint8Array([...inputData, ...randomBytes]);
  
  // Use SHA-256 for hashing
  const hashBuffer = await crypto.subtle.digest('SHA-256', combinedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // Define the character set for the key
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  // Convert hash to alphanumeric string with dashes
  // We'll generate 68 characters (64 + 4 dashes)
  let key = '';
  let charCount = 0;
  
  for (let i = 0; i < 68; i += 1) {
      // Insert dashes at positions 16, 32, 48, and 64
      if (i === 16 || i === 32 || i === 48 || i === 64) {
          key += '-';
      } else {
          // Use modulo to map hash values to alphanumeric characters
          const index = hashArray[charCount % hashArray.length] % alphanumeric.length;
          key += alphanumeric[index];
          charCount += 1;
      }
  }
  
  return key;
}