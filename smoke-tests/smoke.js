#!/usr/bin/env node
import http from "http";

const base = process.argv.includes("--base-url")
  ? process.argv[process.argv.indexOf("--base-url") + 1]
  : process.env.BASE_URL || "http://localhost:3000";

function check(path) {
  return new Promise((resolve, reject) => {
    http.get(`${base}${path}`, (res) => {
      if (res.statusCode && res.statusCode < 400) resolve(true);
      else reject(new Error(`Status ${res.statusCode} for ${path}`));
    }).on("error", reject);
  });
}

async function main() {
  await check("/health");
  await check("/bff/availability?unitId=u1&serviceId=s1&date=2024-01-02");
  console.log("Smoke OK");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
