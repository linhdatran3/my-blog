// scripts/test-db.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDatabase() {
  console.log("🔍 Testing Prisma database connection...");

  try {
    // Test 1: Connection
    console.log("1. Testing connection...");
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Test 2: Create a test user
    console.log("2. Creating test user...");
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: "Test User",
        age: 25,
      },
    });
    console.log("✅ Test user created:", testUser);

    // Test 3: Find all users
    console.log("3. Finding all users...");
    const allUsers = await prisma.user.findMany();
    console.log(`✅ Found ${allUsers.length} users`);

    // Test 4: Update test user
    console.log("4. Updating test user...");
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { age: 26 },
    });
    console.log("✅ Test user updated:", updatedUser);

    // Test 5: Delete test user
    console.log("5. Deleting test user...");
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    console.log("✅ Test user deleted");

    // Test 6: Count remaining users
    console.log("6. Counting remaining users...");
    const userCount = await prisma.user.count();
    console.log(`✅ Total users: ${userCount}`);

    console.log("\n🎉 All tests passed! Prisma is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("👋 Database connection closed");
  }
}

// Run the test
testDatabase().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
