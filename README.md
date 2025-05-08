# open-local-cli

A simple CLI tool to generate QR codes for local servers, making it easy to open your development server on mobile devices connected to the same network.

---

## Features

- **Detects active local servers** on common development ports (e.g., 3000, 8000, 8080, 5173, 5000, etc.).
- **Generates a QR code** for each detected server, so you can quickly open the site on your phone or tablet.
- **Shows your local IP address** for easy reference.
- **Optional flag to show all checked ports** (not just active ones).
- **Works with any framework or server** (React, Vite, Next.js, Express, etc.).

---

## Installation

Install globally from npm:

```sh
npm install -g open-local-cli
```

---

## Usage

From your terminal, simply run:

```sh
open-local
```

This will:
- Scan a set of common local development ports.
- Print your local IP address.
- For each active server found, display a QR code you can scan with your mobile device.

### Show All Ports

To see the status of all checked ports (not just the active ones):

```sh
open-local --show
```

or

```sh
open-local -s
```

---

## Example Output

```
🔍 Checking local server ports...
Local IP Address: 192.168.1.42

✅ Server found on port 3000: http://192.168.1.42:3000
<QR CODE>
Scan the QR code above to open http://192.168.1.42:3000 on your mobile device.

❌ No server found on port 8000.
❌ No server found on port 8080.
...
```

---

## Supported Ports

By default, the tool checks these ports:

- 3000, 3001, 3002
- 8000, 8001, 8002
- 8080, 8081, 8082
- 5173, 5000, 54321

---

## Why?

When developing locally, it's often useful to test your site or app on a real mobile device. This tool makes it effortless to:
- Find your local server's address
- Generate a QR code for instant access on your phone

---

## License

MIT
