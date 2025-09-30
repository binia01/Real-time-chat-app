// src/redis-io.adapter.ts
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import createClient from 'ioredis';
import { Server, ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options) as Server;

    const pubClient = new createClient({
      host: process.env.REDIS_HOST || 'redis',
      port: +(process.env.REDIS_PORT || 6379),
    });
    const subClient = pubClient.duplicate();

    // Add error handlers to avoid crashing
    pubClient.on('error', (err) => {
      console.error('Redis pubClient error:', err);
    });
    subClient.on('error', (err) => {
      console.error('Redis subClient error:', err);
    });

    server.adapter(createAdapter(pubClient, subClient));
    return server;
  }
}
