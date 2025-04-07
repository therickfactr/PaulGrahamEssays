import { dirname } from 'path';
import { fileURLToPath } from 'url';
console.log(import.meta.url)
console.log(fileURLToPath(import.meta.url));
console.log(dirname(fileURLToPath(import.meta.url)));
console.log(import.meta);
console.log(import.meta.resolve.toString());
