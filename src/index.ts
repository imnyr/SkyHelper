import "dotenv/config";
import { SkyHelper } from "#structures";
import { initializeMongoose } from "#src/database/mongoose";
const client = new SkyHelper();

// Load everything
// Change path if different
await client.loadEvents("dist/events");
await client.loadSlashCmd("dist/commands/slash");
await client.loadContextCmd("dist/commands/contexts");
await client.loadButtons("dist/buttons");
await client.loadPrefix("dist/commands/prefix");
initializeMongoose();
// Login
client.login(process.env.TOKEN);
