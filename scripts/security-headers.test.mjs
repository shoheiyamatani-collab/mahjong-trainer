import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { renderCloudflareHeaders, securityHeaders } from "./security-headers.mjs";

function directives(policy) {
  return new Map(policy.split(";").map((part) => {
    const [name, ...values] = part.trim().split(/\s+/);
    return [name, values];
  }));
}

test("generated Cloudflare rules are current and cover all static routes", async () => {
  const file = (await readFile(new URL("../apps/web/public/_headers", import.meta.url), "utf8")).replaceAll("\r\n", "\n");
  assert.equal(file, renderCloudflareHeaders());
  const globalRule = file.split("\n/*\n")[1].split("\nhttps://")[0];
  for (const [name, value] of Object.entries(securityHeaders)) {
    assert.ok(globalRule.includes(`  ${name}: ${value}`));
    assert.doesNotMatch(value, /[\r\n]/);
  }
  assert.doesNotMatch(file, /X-Robots-Tag|Disallow:/i);
});

test("enforced CSP prevents framing, plugins, base URL and form redirection", () => {
  const policy = directives(securityHeaders["Content-Security-Policy"]);
  assert.deepEqual(policy.get("frame-ancestors"), ["'self'"]);
  assert.deepEqual(policy.get("object-src"), ["'none'"]);
  assert.deepEqual(policy.get("base-uri"), ["'self'"]);
  assert.deepEqual(policy.get("form-action"), ["'self'"]);
  assert.equal(securityHeaders["X-Frame-Options"], "SAMEORIGIN");
  assert.equal(securityHeaders["X-Content-Type-Options"], "nosniff");
});

test("CSP rollout preserves static hydration, workers, video and ads", () => {
  const enforced = directives(securityHeaders["Content-Security-Policy"]);
  for (const name of ["default-src", "script-src", "connect-src", "frame-src", "worker-src"]) {
    assert.equal(enforced.has(name), false, `${name} must be observed before enforcement`);
  }
  const monitored = directives(securityHeaders["Content-Security-Policy-Report-Only"]);
  assert.ok(monitored.get("script-src").includes("'unsafe-inline'"));
  assert.ok(monitored.get("script-src").includes("https://*.googlesyndication.com"));
  assert.ok(monitored.get("frame-src").includes("https://www.youtube-nocookie.com"));
  assert.deepEqual(monitored.get("worker-src"), ["'self'", "blob:"]);
  assert.equal(monitored.has("report-uri"), false);
  assert.equal(monitored.has("report-to"), false);
  assert.doesNotMatch(securityHeaders["Content-Security-Policy-Report-Only"], /unsafe-eval/);
});

test("permissions keep video and clipboard available while denying unused sensors", () => {
  const policy = securityHeaders["Permissions-Policy"];
  for (const feature of ["camera", "microphone", "geolocation"]) assert.ok(policy.includes(`${feature}=()`));
  assert.doesNotMatch(policy, /fullscreen|autoplay|clipboard-write/);
});

test("HSTS is production-only, without preload or subdomain lock-in", () => {
  const headers = renderCloudflareHeaders();
  assert.ok(headers.includes("https://jongfolio.com/*\n  Strict-Transport-Security: max-age=15552000"));
  assert.doesNotMatch(headers, /includeSubDomains|preload|localhost|127\.0\.0\.1/);
});
