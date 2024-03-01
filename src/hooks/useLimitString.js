
// export default function useLimitString(string, limit ) {
//   return string?.length > 25 ? `${string?.substring( 0, limit || 25 )}...` : string
// }

export default function useLimitString(string, limit) {
  return string?.length > limit ? `${string?.substring(0, limit )}...` : string;
}