import { createServer } from "http";
import { parse } from "url";
import next from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);

    // Handle SSE endpoint inline
    if (parsedUrl.pathname === "/api/sse") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*", // domain of my vercel
      });

      const intervalId = setInterval(() => {
        res.write(
          `data: ${JSON.stringify({
            message: "Hellow from server",
          })}\n\n`
        );
      }, 3000);

      req.on("close", () => {
        clearInterval(intervalId);
      });
    } else {
      // Handle regular Next.js Request
      handle(req, res, parsedUrl);
    }
  }).listen(port, (err?: Error) => {
    if (err) throw err;
    console.log("Ready on localhost:3000");
  });

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});
