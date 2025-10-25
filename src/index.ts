import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import 'dotenv/config';
import { optionalAuth } from './middleware/auth';


const app = new Hono();

// Lägg middleware globalt
app.use('*', optionalAuth);

app.get('/', (c) => {
  const user = c.get('user');
  if (user) {
    return c.text(`Bnb backend running 🚀 Logged in as ${user.email}`);
  }
  return c.text('Bnb backend running 🚀 Not logged in');
});

serve({
  fetch: app.fetch,
  port: 3000,
});

console.log('✅ Server running at http://localhost:3000');
