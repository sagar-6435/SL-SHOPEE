import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
try {
    execSync('node server.js', { encoding: 'utf8' });
} catch (err) {
    writeFileSync('clean-error.txt', (err.stdout || '') + '\n\n' + (err.stderr || ''));
}
