import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== DIAGNÓSTICO DE VARIABLES DE ENTORNO ===\n');

// Cargar .env
dotenv.config();

console.log('1. Ubicación del proyecto:');
console.log('   ', __dirname);

console.log('\n2. Archivo .env existe?');
const envPath = join(__dirname, '.env');
console.log('   Ruta:', envPath);
console.log('   Existe:', fs.existsSync(envPath) ? '✅ SÍ' : '❌ NO');

if (fs.existsSync(envPath)) {
  console.log('\n3. Contenido del .env (primeras líneas):');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n').slice(0, 15);
  lines.forEach((line, i) => {
    if (line.trim() && !line.startsWith('#')) {
      // Ocultar valores sensibles
      const [key] = line.split('=');
      console.log(`   ${i + 1}. ${key}=***`);
    }
  });
}

console.log('\n4. Variables de entorno cargadas:');
console.log('   MERCADOPAGO_MOCK_MODE:', process.env.MERCADOPAGO_MOCK_MODE);
console.log('   Tipo:', typeof process.env.MERCADOPAGO_MOCK_MODE);
console.log('   Es "true"?:', process.env.MERCADOPAGO_MOCK_MODE === 'true');

console.log('\n5. Otras variables importantes:');
console.log('   PORT:', process.env.PORT);
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   FRONTEND_URL:', process.env.FRONTEND_URL);

console.log('\n=== FIN DEL DIAGNÓSTICO ===');
