const MLEAGUE_ORIGIN = "https://mleague.jongfolio.com";

function isMLeagueRequest(pathname) {
  return (
    pathname === "/mleague" ||
    pathname.startsWith("/mleague/") ||
    pathname.startsWith("/assets/")
  );
}

export async function onRequest(context) {
  const { request } = context;
  const incomingUrl = new URL(request.url);

  if (!isMLeagueRequest(incomingUrl.pathname)) {
    return context.next();
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }

  const upstreamUrl = new URL(
    `${incomingUrl.pathname}${incomingUrl.search}`,
    MLEAGUE_ORIGIN,
  );
  const headers = new Headers(request.headers);
  headers.delete("authorization");
  headers.delete("cookie");
  headers.delete("cf-access-jwt-assertion");
  headers.set("x-forwarded-host", incomingUrl.host);
  headers.set("x-forwarded-proto", incomingUrl.protocol.replace(":", ""));

  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    redirect: "manual",
  });
  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.delete("set-cookie");
  const location = responseHeaders.get("location");

  if (location?.startsWith(MLEAGUE_ORIGIN)) {
    responseHeaders.set(
      "location",
      location.replace(MLEAGUE_ORIGIN, incomingUrl.origin),
    );
  }

  return new Response(request.method === "HEAD" ? null : upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}
