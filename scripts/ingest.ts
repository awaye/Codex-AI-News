import { ingestAllSources } from "../src/lib/ingest";

async function main() {
  const result = await ingestAllSources();
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
