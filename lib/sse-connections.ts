// Store active SSE connections
const connections = new Map<string, ReadableStreamDefaultController>();

// Helper function to push data from callback
export function pushToClient(taskId: string, data: any) {
  const controller = connections.get(taskId);
  if (controller) {
    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
    // Close connection after pushing completion
    controller.close();
    connections.delete(taskId);
  }
}

// Get connections map for route handlers
export function getConnections() {
  return connections;
} 