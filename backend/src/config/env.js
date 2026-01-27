import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
    throw new Error('.env file missing');
}

const envFile = fs.readFileSync(envPath, 'utf-8');

const ENV = {};

envFile.split('\n').forEach(line => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) return;

    const [key, ...rest] = trimmed.split('=');
    ENV[key] = rest.join('=');
});

export default ENV;
