#!/usr/bin/env node

import { Command } from "commander";
import qrcode from "qrcode-terminal";
import chalk from "chalk";
import net from "node:net";
import os from "node:os";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { version } = require("./package.json"); // To get version from package.json

const program = new Command();

const PORTS_TO_CHECK = [3000, 3001, 3002, 8000, 8001, 8002, 8080, 8081, 8082, 5173, 5000, 54321]; // Added a few more common ones

// Function to get local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      const { address, family, internal } = iface;
      if (family === "IPv4" && !internal) {
        return address;
      }
    }
  }
  return "127.0.0.1"; // Fallback
}

// Function to check if a port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(true); // Port is in use
      } else {
        resolve(false); // Other error, assume not in use for simplicity
      }
    });
    server.once("listening", () => {
      server.close();
      resolve(false); // Port is not in use
    });
    server.listen(port, "0.0.0.0");
  });
}

program
  .name("open-local")
  .description(
    "CLI tool to generate QR codes for locally running servers."
  )
  .version(version, "-v, --version", "Output the current version");

program
  .option(
    "-s, --show",
    "Show status of all checked ports, not just active ones"
  )
  .action(async (options) => {
    const ipAddress = getLocalIpAddress();
    let activeServersFound = false;

    console.log(chalk.blue.bold("🔍 Checking local server ports..."));
    console.log(chalk.gray(`Local IP Address: ${ipAddress}\n`));

    for (const port of PORTS_TO_CHECK) {
      const isPortInUse = await checkPort(port);

      if (isPortInUse) {
        activeServersFound = true;
        const url = `http://${ipAddress}:${port}`;
        console.log(
          chalk.green(`✅ Server found on port ${port}: ${url}`)
        );
        qrcode.generate(url, { small: true }, (qr) => {
          console.log(qr);
        });
        console.log(
          chalk.yellow(
            `Scan the QR code above to open ${url} on your mobile device.\n`
          )
        );
      } else if (options.show) {
        console.log(
          chalk.red(`❌ No server found on port ${port}.`)
        );
      }
    }

    if (!activeServersFound && !options.show) {
      console.log(
        chalk.yellow(
          "No active servers found on the default ports."
        )
      );
      console.log(
        chalk.cyan(
          "Use 'open-local --show' to see the status of all checked ports."
        )
      );
    } else if (!activeServersFound && options.show) {
      console.log(
        chalk.yellow(
          "\nNo active servers found on any of the checked ports."
        )
      );
    } else if (activeServersFound && options.show) {
        console.log(chalk.blue.bold("\n✨ Scan complete."));
    }
  });

program.parse(process.argv);
