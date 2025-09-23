import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: { email: "test@test.com", name: "Tester", age: 30, weight: 80, height: 180 },
  });
  console.log("User creado:", user);
}

main().finally(async () => {
  await prisma.$disconnect();
});
