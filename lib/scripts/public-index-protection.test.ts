import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { canReadPublicScriptBody } from "./body-access";
import { scriptSubmissionSchema } from "./schema";

describe("tracked public search artifact", () => {
 it("contains no protected body excerpts even when catalog metadata remains searchable", async () => {
  const root = process.cwd();
  const index = JSON.parse(await readFile(join(root,"public/script-index.json"),"utf8")) as {scripts:Array<{source_type:string;category:string;slug:string;script_body_excerpt:string}>};
  let protectedEntries = 0;
  for (const entry of index.scripts) {
   const metadata = scriptSubmissionSchema.parse(JSON.parse(await readFile(join(root,"content/scripts",entry.source_type,entry.category,entry.slug,entry.slug+".json"),"utf8")));
   if (!canReadPublicScriptBody(metadata)) {
    protectedEntries++;
    // Boolean assertion deliberately avoids printing source contents on failure.
    expect(entry.script_body_excerpt === "").toBe(true);
   }
  }
  expect(protectedEntries).toBeGreaterThan(0);
 });
});
