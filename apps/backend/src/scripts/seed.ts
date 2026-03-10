import { ExecArgs } from "@medusajs/framework/types";
import initialSeed from "../migration-scripts/25022026-initial-seed";

export default async function seedDemoData(args: ExecArgs) {
  return initialSeed(args);
}
