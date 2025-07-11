// scripts/update-schema.ts
import { exec } from "child_process";
// import { promisify } from 'util';

// const execAsync = promisify(exec);

console.log("🔄 Starting schema update process...");

// Function to run commands
async function runCommand(command: string, description: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`\n⏳ ${description}...`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.log(`⚠️  Warning: ${stderr}`);
      }
      if (stdout) {
        console.log(stdout);
      }
      console.log(`✅ ${description} completed`);
      resolve();
    });
  });
}

async function updateSchema() {
  try {
    // 1. Push schema changes
    await runCommand(
      "npx prisma db push",
      "Pushing schema changes to database",
    );

    // 2. Generate Prisma Client
    await runCommand("npx prisma generate", "Generating Prisma Client");

    console.log("\n🎉 Schema update completed successfully!");
    console.log("📝 Next steps:");
    console.log(
      '   1. Restart TypeScript Server in VS Code (Ctrl+Shift+P → "TypeScript: Restart TS Server")',
    );
    console.log("   2. Your dev server should auto-reload");
  } catch (error) {
    console.error("\n❌ Schema update failed:", error);
    process.exit(1);
  }
}

updateSchema();
