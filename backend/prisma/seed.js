const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('AdminPass1!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Administrator Main Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      address: 'Admin Office, 1 Main Street',
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.email);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());