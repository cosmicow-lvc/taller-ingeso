# Taller Ingeniería de Software
**Integrantes**
1. Julian Gallardo Cortés 21836146-3
2. Máximo Jofré Letelier 21675371-2
3. Nicolás Cordero Varas 20543155-1
4. Maximiliano Urrutia 21573565-6

## Requisitos

1. **Node.js LTS** (https://nodejs.org) → incluye `npm`.
2. **PostgreSQL 14+** (https://www.postgresql.org/download/windows/) → asegúrate de instalar también pgAdmin o, al menos, `psql` y de dejar el servicio corriendo.
3. (Opcional) **Git** para clonar el repositorio si aún no lo tienes.


## Ejecución Linux/Mac:
Backend -> Abre una terminal:

cd backend
createdb -U postgres -h localhost -p 5432 taller_ingeso
//en este punto, te debería solicitar una contraseña -> 1234
npm start

Frontend -> Abre otra terminal:

cd frontend
npm run dev

## Ejecución Windows:
Backend:
cd backend
psql -U postgres -c "CREATE DATABASE taller_ingeso;
//en este punto, te debería solicitar una contraseña -> 1234
create_productos_tables.sql
seed_productos.sql
npm start

Frontend:
cd frontend
npm run dev