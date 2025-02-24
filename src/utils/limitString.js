export default function limitString(string, limit) {
  return string?.length > limit ? `${string?.substring(0, limit )}...` : string;
}