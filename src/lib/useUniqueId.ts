import { v4 as uuidv4 } from 'uuid';

export default function generateUniqueKey(): string {
  return uuidv4();
}