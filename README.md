# OpenTelemetry Integration for E-Commerce Application


This guide explains how to integrate OpenTelemetry into a Node.js application(E-Commerce Application) for tracing and observability. It is designed for anyone, even those new to OpenTelemetry, and explains every step in detail.


---

![OpenTelemetry Logo](https://opentelemetry.io/img/logos/opentelemetry-horizontal-color.png)

![Node.js](https://img.shields.io/badge/Node.js-v18.0-green) ![OpenTelemetry](https://img.shields.io/badge/OpenTelemetry-v1.30-blue) ![License](https://img.shields.io/github/license/DevopsProjects05/otel-ecommerce-integration)

---



## **What is OpenTelemetry?**
OpenTelemetry (OTel) is a set of APIs, libraries, and tools for generating, collecting, processing, and exporting telemetry data such as traces, metrics, and logs. It is used to monitor applications, understand their behavior, and identify issues in distributed systems.

- **Traces**: Tracks the flow of requests through services.
- **Metrics**: Numerical data about system behavior (e.g., request count, latency).
- **Logs**: Detailed event information for debugging.
---

### **Why Use OpenTelemetry?**
- Provides insights into how requests flow through your application.
- Helps troubleshoot bottlenecks and errors.
- Works with multiple observability tools like Jaeger, Prometheus, and more.

---

## **Features**
- **OpenTelemetry Tracing**: Seamlessly integrated with Node.js application.
- **Custom Spans**: Enhanced observability with detailed spans.
- **OpenTelemetry Collector**: Processes and exports traces efficiently.
- **Scalable Setup**: Ready to integrate with visualization tools like Jaeger or Prometheus.

---

## **Prerequisites**
- AWS Account (to create EC2 instances)
- Node.js (v18 or higher)
- npm (v8 or higher)
- OpenTelemetry Collector

---

## **Step-by-Step Guide**

### **1. Launch an EC2 Instance**

#### **Choose Instance Type and Security Group**
1. Launch an EC2 instance using AWS Management Console or CLI.
2. Select the following configuration:
   - **Instance Type**: `t2.medium` (2 vCPUs and 4 GiB memory).
   - **Ports to Open in Security Group**:
     - **3000**: For the Node.js application.
     - **4317**: For OpenTelemetry Collector gRPC receiver.
     - **4318**: For OpenTelemetry Collector HTTP receiver.
     - **22**: For SSH access.


- **Why:** This sets up the environment to run the application and the OpenTelemetry Collector.
- **Result:** An EC2 instance is launched and ready for configuration.

---

### **2. Clone the Repository**
This repository contains a sample Node.js application with OpenTelemetry integration.

# Clone the project repository
```bash
git clone https://github.com/DevopsProjects05/otel-ecommerce-integration.git
```


# Navigate to the application source code
```bash
cd otel-ecommerce-integration/src/
```
- **Why:** The repository contains all the code and configurations needed for this setup.
- **Result:** You will have the project files on your local machine.

---

### **3. Install Required Dependencies**
Install the necessary OpenTelemetry packages in the project directory.
```bash
npm install @opentelemetry/api @opentelemetry/sdk-trace-node @opentelemetry/exporter-trace-otlp-http @opentelemetry/resources
```
- **Why:** These packages enable OpenTelemetry tracing in the Node.js application.
  - `@opentelemetry/api`: Core OpenTelemetry API.
  - `@opentelemetry/sdk-trace-node`: SDK for Node.js tracing.
  - `@opentelemetry/exporter-trace-otlp-http`: Exports trace data to the OpenTelemetry Collector.
  - `@opentelemetry/resources`: Defines attributes for your application (e.g., service name).
- **Result:** The required OpenTelemetry libraries are installed, and a `package-lock.json` file will be generated.

Verify the presence of `package-lock.json`:
```bash
ls
```

---

### **4. Update `server.js`**
Edit the `server.js` file to configure OpenTelemetry and provide your Collector’s IP address.
```bash
vi server.js
```
- Find the following section:
  ```javascript
  url: 'http://<collector-ip>:4318/v1/traces' // Replace <collector-ip> with your actual IP
  ```
- Replace `<collector-ip>` with the IP address of your OpenTelemetry Collector.

- **Why:** The `url` specifies where the application should send trace data.
- **Result:** Your Node.js application will be able to send traces to the Collector.

---

### **5. Start the Application**
Run the application to start generating traces.
```bash
node server.js
```
- **Why:** This starts the backend server, enabling tracing for incoming requests.
- **Result:** The application will listen for requests on port 3000 (default).

Access the application in your browser:
```
http://<your-server-ip>:3000
```

---

### **6. Download and Set Up OpenTelemetry Collector**
The OpenTelemetry Collector processes and exports telemetry data from the application to a desired backend.

#### **Download the Collector**
```bash
wget https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v0.83.0/otelcol-contrib_0.83.0_linux_amd64.tar.gz
```
- **Why:** Downloads the OpenTelemetry Collector binary (Contrib version).
- **Result:** A `.tar.gz` file is downloaded.

#### **Extract the File**
```bash
tar -xvf otelcol-contrib_0.83.0_linux_amd64.tar.gz
```
- **Why:** Extracts the Collector binary.
- **Result:** You will get an executable file named `otelcol-contrib`.

#### **Move the Binary to a System-Wide Location**
```bash
sudo mv otelcol-contrib /usr/local/bin/otelcol
```
- **Why:** Places the binary in a directory included in your system’s PATH, so you can run it from anywhere.
- **Result:** The Collector is installed and ready to use.

#### **Verify Installation**
```bash
otelcol --version
```
- **Why:** Confirms that the Collector is installed correctly.
- **Result:** Displays the version of the Collector.

---

### **7. Run the OpenTelemetry Collector**
Ensure the `otel-collector-config.yaml` file is present in your directory. Run the Collector with the configuration file.
```bash
otelcol --config otel-collector-config.yaml
```
- **Why:** Starts the Collector with the specified configuration.
  - Receives traces from your application.
  - Processes and exports traces to the desired backend (e.g., logging, Jaeger).
- **Result:** The Collector is running and ready to process telemetry data.

Check the Collector logs to confirm traces are being received:
```bash
INFO    TracesExporter  {"kind": "exporter", "data_type": "traces", "resource spans": 1, "spans": 1}
```

---

### **8. Enhance Tracing in the Application**
Add custom spans to improve the observability of specific routes.

#### **Edit `server.js` to Add Custom Spans**
```bash
vi /root/otel-ecommerce-integration/src/server.js
```
Add the following code to create a custom span for the `/custom` route:
```javascript
app.get('/custom', (req, res) => {
    const span = tracer.startSpan('Custom Route Span');
    res.send('This is a custom route');
    span.end();
});
```
- **Why:** Custom spans provide detailed observability for specific operations.
- **Result:** Requests to `/custom` will generate a new span named `Custom Route Span`.

#### **Restart the Application**
```bash
node server.js
```
- **Why:** Applies the changes to the server.
- **Result:** The application restarts with the new custom span functionality.

#### **Test the Custom Route**
Visit the custom route in your browser or using `curl`:
```bash
http://<your-server-ip>:3000/custom
```
- **Why:** Generates traffic to test the new custom span.
- **Result:** A span is created for the `/custom` route and sent to the Collector.

---

### **9. Verify Traces**
Check the OpenTelemetry Collector logs to confirm that the custom span is being collected:
```bash
INFO    TracesExporter  {"kind": "exporter", "data_type": "traces", "resource spans": 1, "spans": 1}
```

---

## **How It Works**
1. The Node.js application generates trace data for each request.
2. The trace data is sent to the OpenTelemetry Collector via OTLP (OpenTelemetry Protocol).
3. The Collector processes the traces and exports them to:
   - Logging for debugging.
   - Visualization tools like Jaeger (optional).

---

## **Future Enhancements**
- **Integrate with Prometheus**: Add metrics collection and visualization.
- **Add Logging**: Enhance observability with structured logs.
- **Deploy in Production**: Set up Kubernetes for scaling the application.
- **CI/CD Pipeline**: Automate deployments with Jenkins or GitHub Actions.

---





## **Conclusion**
By following this guide, you:
1. Integrated OpenTelemetry into a Node.js application.
2. Set up the OpenTelemetry Collector to process and export traces.
3. Enhanced application observability with custom spans.

This setup showcases foundational observability practices and prepares you to discuss and demonstrate your knowledge in interviews.

---

