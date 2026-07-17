const fs = require('fs');

const content = `PORT=5000
MONGODB_URI=mongodb+srv://sagarnaidu6435:sagar8897@cluster0.ues2hnj.mongodb.net/
JWT_SECRET=sagar123
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=drhizqjxv
CLOUDINARY_API_KEY=5628363d80991
CLOUDINARY_API_SECRET=GDwKwEK
ADMIN_EMAIL=admin@gmail.app
ADMIN_PASSWORD=admin@123
CHATMITRA_API_KEY=166b78bd2b6
ENABLE_TEST_PAYMENTS=true
`;

fs.writeFileSync('.env', content, 'utf8');
fs.writeFileSync('.env.production', content, 'utf8');
console.log('Environment files fixed successfully.');
