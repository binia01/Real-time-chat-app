import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';
import { UseGuards, UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  server: Server;

  constructor(private chatService: ChatService, private authService: AuthService) {}

  afterInit(server: Server) {
    this.server = server;
  }

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) throw new UnauthorizedException('No token provided');

      // Verify JWT
      const payload = this.authService.verifyToken(token);
      client.data.userId = payload.sub; // store userId in socket session
    } catch (err) {
      console.log('Unauthorized connection', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string }) {
    if (!client.data.userId) return;
    client.join(payload.room);
    console.log(`Client ${client.data.userId} joined room ${payload.room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string }) {
    client.leave(payload.room);
    console.log(`Client ${client.data.userId} left room ${payload.room}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; text: string; conversationId?: number; groupId?: number },
  ) {
    if (!client.data.userId) return;

    // Save message
    const msg = await this.chatService.saveMessage({
      text: payload.text,
      senderId: client.data.userId,
      conversationId: payload.conversationId,
      groupId: payload.groupId,
    });

    // Fetch username
    const user = await this.chatService.getUserById(client.data.userId);

    // Emit to everyone in the room
    this.server.to(payload.room).emit('receiveMessage', {
      ...msg,
      username: user?.username || `User ${client.data.userId}`,
    });
  }
}
