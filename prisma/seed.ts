import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const main = async () => {
  const passwordHash = await bcrypt.hash("Admin123456", 10);

  const platformTenant = await prisma.tenant.upsert({
    where: {
      name: "Platform",
    },
    update: {},
    create: {
      name: "Platform",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "superadmin@example.com",
    },
    update: {
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      tenantId: platformTenant.id,
    },
    create: {
      email: "superadmin@example.com",
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      tenantId: platformTenant.id,
    },
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
