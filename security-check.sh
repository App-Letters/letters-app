#!/bin/bash

echo "=================================================="
echo "🛡️  INICIANDO ESCANEO DE SEGURIDAD - HALLEL KEHILA"
echo "=================================================="

# 1. Escaneo de dependencias (SAST básico)
echo -e "\n📦 1. Revisando dependencias vulnerables (npm audit)..."
# Usamos --audit-level para ignorar advertencias bajas que no afectan a producción
npm audit --production --audit-level=moderate

# 2. Búsqueda de secretos hardcodeados
echo -e "\n🕵️‍♂️ 2. Buscando credenciales o secretos en el código fuente..."
# Esto busca si por error escribiste tu contraseña de Mongo o NextAuth directo en un archivo .ts o .tsx
grep -rnw --exclude-dir={node_modules,.git,.next} --exclude=\*.env* --exclude=security-check.sh 'mongodb+srv\|NEXTAUTH_SECRET\|password: ' .
if [ $? -eq 0 ]; then
    echo "⚠️  ¡ALERTA! Se encontraron posibles secretos escritos directamente en el código. Revísalos."
else
    echo "✅ No se encontraron secretos hardcodeados."
fi

# 3. Revisión de Linting estricto
echo -e "\n🧹 3. Ejecutando el Linter de Next.js..."
npm run lint

echo -e "\n=================================================="
echo "✅ ESCANEO FINALIZADO."
echo "=================================================="
