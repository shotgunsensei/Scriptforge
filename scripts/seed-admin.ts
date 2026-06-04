import { getAdminSeedConfig, seedAdminUser } from "../lib/scripts/admin-users";

async function run() {
  const config = getAdminSeedConfig();

  if (!config.password) {
    throw new Error("SCRIPTFORGE_ADMIN_SEED_PASSWORD is required to seed the admin account.");
  }

  const { user, created } = await seedAdminUser(config);

  process.stdout.write(
    created
      ? `Seeded ScriptForge admin account ${user.email} with role ${user.role}.\n`
      : `ScriptForge admin account ${user.email} already exists. No changes made.\n`,
  );
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : "Failed to seed ScriptForge admin account.";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
