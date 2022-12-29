const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const todos = await prisma.todo.findMany();

  console.log(todos);
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
