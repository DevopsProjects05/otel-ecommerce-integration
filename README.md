# OpenTelemetry Integration for E-Commerce Application

# **otel-ecommerce-integration**

This project is a simple e-commerce website integrated with OpenTelemetry for observability. It demonstrates the setup of a Node.js server with Express, serving static assets, and implementing frontend and backend observability with OpenTelemetry.

---

## **Setup Instructions**

### **1. Create an AWS EC2 Instance**
- **Instance Type**: `t3.medium`
  - **vCPUs**: 2
  - **Memory**: 4 GiB
  - **Networking**: Moderate baseline with burst capabilities.
- **Commands**:
  ```bash
  sudo yum update -y
  sudo yum install git -y
  ```

---

### **2. Clone the Repository**
Clone the project repository to your system:
```bash
git clone https://github.com/DevopsProjects05/otel-ecommerce-integration.git
cd otel-ecommerce-integration/src
```

---

### **3. Install Node.js and npm**
#### **Why Install Node.js?**
Node.js is required to serve the application backend, while npm (Node Package Manager) is essential to manage JavaScript dependencies like OpenTelemetry SDK for frontend tracing.

#### **Install Node.js**:
```bash
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

#### **Verify Installation**:
```bash
node -v
npm -v
```

---

### **4. Backend Setup**
#### **Step 1: Create a Backend Directory**
Navigate to the project directory and create a backend folder:
```bash
cd /root/otel-ecommerce-integration/src/public
mkdir backend
cd backend
```

#### **Step 2: Initialize a Node.js Project**
Run the following command to initialize a new Node.js project:
```bash
npm init -y
```

This will create a `package.json` file for your project.

#### **Step 3: Install Dependencies**
Install the required dependencies for the backend:
```bash
npm install express @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-http
```

---

### **5. Create the Backend Server**
Create a `server.js` file in the backend directory:
```bash
vi server.js
```

Add the following code:

```javascript
const express = require('express');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

// Initialize OpenTelemetry
const traceExporter = new OTLPTraceExporter({
  url: 'http://<collector-ip>:4318/v1/traces', // Replace <collector-ip> with your OpenTelemetry Collector's IP
});
const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();

const app = express();
const port = 3000;

// Serve static files
app.use(express.static('../public'));

// Define routes
app.get('/', (req, res) => {
  res.sendFile('/root/otel-ecommerce-integration/src/index.html'); // Update the path if needed
});

app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: 'Product A', price: 100 },
    { id: 2, name: 'Product B', price: 200 },
  ]);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Handle process shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Telemetry SDK shut down'))
    .catch(console.error)
    .finally(() => process.exit(0));
});
```

---

### **6. Start the Server**
Navigate to the `src/public/backend` directory and start the server:
```bash
node server.js
```

You should see:
```
Server running at http://localhost:3000
```

---

### **7. Access the Website**
Open your browser and visit:
```
http://<your-public-ip>:3000
```
For example:
```
http://13.127.152.35:3000
```

---

### **File Structure**
```
otel-ecommerce-integration/
├── src/
│   ├── public/
│   │   ├── style.css             # Static CSS file
│   │   ├── script.js             # Static JavaScript file
│   ├── index.html                # Main HTML file
│   ├── backend/
│   │   ├── server.js             # Node.js backend server
│   │   ├── package.json          # Backend project configuration
│   │   ├── package-lock.json     # Lock file for npm dependencies
```

---

### **Why Each Command Is Used**

#### **1. `yum install git -y`**
Installs Git for cloning the project repository.

#### **2. `npm init -y`**
Initializes a Node.js project and creates a `package.json` file to track project dependencies.

#### **3. `npm install express`**
Installs the Express library to create and run the Node.js server.

#### **4. `npm install @opentelemetry/*`**
Installs OpenTelemetry dependencies for observability and tracing.

#### **5. `node server.js`**
Starts the Node.js server, which:
- Serves the main `index.html` file.
- Serves static assets (`style.css` and `script.js`) from the `public` directory.
- Enables backend observability using OpenTelemetry.

---

### **Future Enhancements**
1. Add database integration for products.
2. Implement user authentication and cart functionality.
3. Extend OpenTelemetry setup to include frontend tracing.

---

This README provides a clear and comprehensive guide to set up and run your project. Let me know if you’d like to add or modify anything!








