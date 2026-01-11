import fs from "fs";
import { glob } from "glob";

const md = await glob("public/posts/**/*.md");
const md_paths = md.map((f) => f.replace("public", ""));
fs.writeFileSync("public/posts-index.json", JSON.stringify(md_paths));

const json = await glob("public/interests/**/*.json");
const json_paths = json.map((f) => f.replace("public", ""));
fs.writeFileSync("public/interests-index.json", JSON.stringify(json_paths));
