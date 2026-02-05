// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
// Show the UI with access to network
figma.showUI(__html__, { width: 300, height: 400 });

// Handle messages from UI
figma.ui.onmessage = async (msg: { type: string, comments?: any[], token?: string, fileKey?: string }) => {
  if (msg.type === 'ui-ready') {
    const token = process.env.FIGMA_ACCESS_TOKEN;
    const fileKey = figma.fileKey;
    console.log('Sending settings to UI. FileKey:', fileKey, 'Token exists:', !!token);
    figma.ui.postMessage({ type: 'settings', token, fileKey });
    return;
  }

  if (msg.type === 'create-annotations') {
    const comments = msg.comments;
    if (!comments || comments.length === 0) {
      figma.notify('No comments found');
      return;
    }

    let createdCount = 0;

    // Process comments
    for (const comment of comments) {
      // Only process comments that are attached to nodes (have client_meta.node_id)
      // and let's start with root comments or handle replies? The prompt says "converts Figma Comments".
      // Usually you want to display the message.

      const nodeId = comment.client_meta?.node_id;
      if (nodeId) {
        try {
          const node = await figma.getNodeByIdAsync(nodeId);
          if (node) {
            // Create annotation
            // According to documentation: node.annotations = [{ label: 'text' }]
            // We should preserve existing annotations if possible, but the requirement is "onverts".
            // Let's append to existing.

            const newAnnotation = {
              label: comment.message
            };

            // Check if node supports annotations? 
            // "All nodes except slice and group nodes can have annotations" - (actually most nodes can)
            // But we need to check if we can write to it.
            if ('annotations' in node) {
              const existingAnnotations = node.annotations || [];
              node.annotations = [...existingAnnotations, newAnnotation];
              createdCount++;
            }
          }
        } catch (err) {
          console.error('Error processing comment for node ' + nodeId, err);
        }
      }
    }

    figma.notify(`Created ${createdCount} annotations from ${comments.length} comments`);
  }

  // figma.closePlugin(); // Don't close immediately so we can see the result/status
};
