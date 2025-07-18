const logs: string[] = [];

export function serverLog(message: string, data?: unknown) {
  const logEntry = `[${new Date().toISOString()}] ${message} ${data ? JSON.stringify(data) : ""}`;
  logs.push(logEntry);
  console.log(logEntry); // Vẫn log ra server
}

export async function GET() {
  return Response.json({ logs });
}
