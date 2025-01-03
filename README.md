# OpenTelemetry Integration for E-Commerce Application

# Node.js Application with OpenTelemetry Integration

This README provides a detailed step-by-step guide to setting up a Node.js application integrated with OpenTelemetry for distributed tracing. Even a beginner can follow this to achieve the desired result.

---

## **Table of Contents**
- [OpenTelemetry Integration for E-Commerce Application](#opentelemetry-integration-for-e-commerce-application)
- [Node.js Application with OpenTelemetry Integration](#nodejs-application-with-opentelemetry-integration)
  - [**Table of Contents**](#table-of-contents)
  - [**Prerequisites**](#prerequisites)
  - [**Step 1: Launch an EC2 Instance**](#step-1-launch-an-ec2-instance)
  - [**Step 2: Connect to the Instance**](#step-2-connect-to-the-instance)
  - [**Step 3: Install Node.js**](#step-3-install-nodejs)
  - [**Step 4: Set Up Your Node.js Application**](#step-4-set-up-your-nodejs-application)
  - [**Step 5: Integrate OpenTelemetry**](#step-5-integrate-opentelemetry)
  - [**Step 6: Set Up the OpenTelemetry Collector**](#step-6-set-up-the-opentelemetry-collector)
  - [**Step 7: Verify the Setup**](#step-7-verify-the-setup)

---

## **Prerequisites**
- An AWS account to launch an EC2 instance.
- Basic knowledge of Node.js and npm.
- A GitHub repository for your Node.js project (optional).

---

## **Step 1: Launch an EC2 Instance**
1. Log in to the AWS Management Console and navigate to **EC2**.
2. Click **Launch Instance** and configure the following:
   - **Name**: `nodejs-opentelemetry-instance`.
   - **AMI**: Amazon Linux 2.
   - **Instance Type**: `t2.medium`.
   - **Key Pair**: Select or create a key pair for SSH access.
   - **Security Group**: Allow the following ports:
     - **22**: SSH access.
     - **3000**: Node.js application.
   - **Storage**: At least 10 GB.
3. Launch the instance and wait for it to initialize.

---

## **Step 2: Connect to the Instance**
1. Open a terminal and connect to your instance using SSH:
   ```bash
   ssh -i "your-key.pem" ec2-user@<your-instance-public-ip>
   ```
   Replace `your-key.pem` with your private key file and `<your-instance-public-ip>` with the public IP of your instance.

2. Verify the connection by checking the prompt:
   ```
   [ec2-user@ip-xxx-xxx-xxx-xxx ~]$
   ```

---

## **Step 3: Install Node.js**
1. Update the package manager:
   ```bash
   sudo yum update -y
   ```

2. Install Node.js using NodeSource:
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   ```

3. Verify the installation:
   ```bash
   node -v
   npm -v
   ```

---

## **Step 4: Set Up Your Node.js Application**
1. Clone your project from GitHub or create a new directory:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```
   OR
   ```bash
   mkdir nodejs-app && cd nodejs-app
   npm init -y
   ```

2. Install Express:
   ```bash
   npm install express
   ```

3. Create a file named `server.js`:
   ```bash
   nano server.js
   ```

4. Add the following code:
   ```javascript
   const express = require('express');
   const app = express();

   app.get('/', (req, res) => {
       res.send('Hello, OpenTelemetry!');
   });

   const PORT = 3000;
   app.listen(PORT, () => {
       console.log(`Server is running on http://localhost:${PORT}`);
   });
   ```

5. Save and exit.
6. Run the application:
   ```bash
   node server.js
   ```
   Visit `http://<your-instance-public-ip>:3000` in a browser.

---

## **Step 5: Integrate OpenTelemetry**
1. Install OpenTelemetry dependencies:
   ```bash
   npm install @opentelemetry/sdk-node @opentelemetry/api @opentelemetry/auto-instrumentations-node
   ```

2. Create a `tracing.js` file:
   ```bash
   nano tracing.js
   ```

3. Add the following code:
   ```javascript
   const { NodeSDK } = require('@opentelemetry/sdk-node');
   const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
   const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

   const sdk = new NodeSDK({
       traceExporter: new OTLPTraceExporter({ url: 'http://localhost:4318/v1/traces' }),
       instrumentations: [getNodeAutoInstrumentations()],
   });

   sdk.start();
   console.log('OpenTelemetry initialized');
   ```

4. Update `server.js` to include tracing:
   ```javascript
   require('./tracing');
   const express = require('express');
   const app = express();

   app.get('/', (req, res) => {
       res.send('Hello, OpenTelemetry!');
   });

   const PORT = 3000;
   app.listen(PORT, () => {
       console.log(`Server is running on http://localhost:${PORT}`);
   });
   ```

5. Restart the application:
   ```bash
   node server.js
   ```

---

## **Step 6: Set Up the OpenTelemetry Collector**
1. Download the collector binary:
   ```bash
   wget https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v0.83.0/otelcol-contrib_0.83.0_linux_amd64.tar.gz
   ```

2. Extract and install:
   ```bash
   tar -xvf otelcol-contrib_0.83.0_linux_amd64.tar.gz
   sudo mv otelcol-contrib /usr/local/bin/otelcol
   ```

3. Verify installation:
   ```bash
   otelcol --version
   ```

4. Create a `config.yaml` file:
   ```bash
   nano config.yaml
   ```
   Add the following content:
   ```yaml
   receivers:
     otlp:
       protocols:
         grpc:
         http:

   exporters:
     logging:

   service:
     pipelines:
       traces:
         receivers: [otlp]
         exporters: [logging]
   ```

5. Start the collector:
   ```bash
   otelcol --config config.yaml
   ```

---

## **Step 7: Verify the Setup**
1. Send requests to your application:
   ```bash
   curl http://<your-instance-public-ip>:3000
   ```

2. Check the Node.js application logs for incoming requests.
3. Check the OpenTelemetry Collector logs for traces being received and exported:
   - Look for logs like:
     ```
     INFO    TracesExporter  {"kind": "exporter", "data_type": "traces", "name": "logging", "resource spans": 1, "spans": 1}
     ```

---

Congratulations! Your Node.js application is now integrated with OpenTelemetry for distributed tracing. Let me know if you'd like to expand this further to include metrics or visualization tools like Jaeger or Grafana.

