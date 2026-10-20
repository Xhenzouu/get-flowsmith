# Flowsmith — AI Workflow Builder

An interactive, visual workflow builder inspired by n8n and Apple Shortcuts. Built with React Flow and client-side state simulation.

**Live Demo:** [getflowsmith.lovable.app](https://get-flowsmith.lovable.app)

## 🚀 Features

- **Visual Canvas:** Drag-and-drop nodes on a dark themed React Flow canvas.
- **Click-to-Add UX:** Add nodes via a central "+" button (empty state) or via the dynamic "+" handle on the last node in a chain.
- **Auto-Connect:** Selecting a node from the modal automatically spawns it to the right and connects the edge.
- **Edge Hover Menu:** Hover over any connection line to insert a node mid-chain or delete the connection.
- **Node Properties:** Click any node to open a settings modal to rename it and configure its specific payload.
- **Execution Simulation:** Click "Run Workflow" to watch the nodes light up sequentially while a mock execution log slides up from the bottom.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Canvas Engine:** React Flow
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 📦 Run Locally

1. Clone the repo:

   ```bash
   git clone https://github.com/Xhenzouu/getflowsmith.git
   cd getflowsmith
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```
