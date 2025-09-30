import { Controller, Get, Post, Body, Req, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/auth/jwt-aut.guard';

@Controller('chat')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  
  @Get('rooms')
  async getRooms(@Req() req) {
    return this.chatService.getAllRooms();
  }

  @Post('rooms')
  async createRoom(@Req() req, @Body() body: { name: string }) {
    const userId = req.user.id;
    return this.chatService.createGroupRoom(userId, body.name);
  }

  @Get('rooms/:groupId/messages')
  async getRoomMessages(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.chatService.getMessagesByGroup(groupId);
  }
}
