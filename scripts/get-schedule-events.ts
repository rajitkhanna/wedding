import { init } from "@instantdb/admin";
import schema from "../src/instant.schema";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN!;

const db = init({ appId: APP_ID, adminToken: ADMIN_TOKEN, schema });

async function main() {
  const data = await db.query({ scheduleEvents: {} });
  console.log(JSON.stringify(data.scheduleEvents, null, 2));
}

main();
