document.addEventListener('DOMContentLoaded', function() {
    // Sample products
    const products = [
        { id: 1, name: 'Product 1', price: '$100' },
        { id: 2, name: 'Product 2', price: '$150' },
        { id: 3, name: 'Product 3', price: '$200' },
    ];

    // Get the products container from the DOM
    const productsContainer = document.querySelector('.products');

    // Loop through the products and create HTML for each one
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: ${product.price}</p>
            <button class="add-to-cart">Add to Cart</button>
        `;
        
        // Append the product to the products container
        productsContainer.appendChild(productElement);
    });

    // Optional: Add event listener for "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            alert('Added to cart');
        });
    });
});


import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';

// Initialize the tracer provider
const provider = new WebTracerProvider();
const exporter = new OTLPTraceExporter({
  url: 'http://<collector-ip>:4318/v1/traces', // Replace <collector-ip> with your OTel Collector's IP
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

// Example tracer
const tracer = provider.getTracer('ecommerce-frontend');

// Trace a button click
document.getElementById('buy-now').addEventListener('click', () => {
  const span = tracer.startSpan('buy-now-click');
  console.log('Buy Now clicked!');
  span.end();
});
