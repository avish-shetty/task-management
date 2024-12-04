const amqp = require('amqplib');

let channel;
const queue = 'notifications_queue';

// Function to connect to RabbitMQ
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect('amqp://localhost:5673');
    channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    process.exit(1); // Exit the process if RabbitMQ connection fails
  }
}

// Function to publish an event to RabbitMQ
function publishToQueue(event) {
  if (channel) {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)), { persistent: true });
    console.log('Event published:', event);
  } else {
    console.error('RabbitMQ channel is not available');
  }
}

module.exports = { connectRabbitMQ, publishToQueue };