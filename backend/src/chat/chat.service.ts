import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(data: { text: string; senderId: number; conversationId?: number; groupId?: number }) {
    return this.prisma.message.create({
      data: {
        text: data.text,
        senderId: data.senderId,
        conversationId: data.conversationId || null,
        groupId: data.groupId || null,
      },
      include: {
        sender: true,
      },
    });
  }

  async getMessages(conversationId?: number, groupId?: number) {
    return this.prisma.message.findMany({
      where: {
        conversationId: conversationId || undefined,
        groupId: groupId || undefined,
      },
      orderBy: { createdAt: 'asc' },
      include: { sender: true },
    });
  }

  async createGroupRoom(userId: number, name: string) {
    // Create new group
    const group = await this.prisma.group.create({
      data: {
        name,
        members: {
          create: [{ userId }],
        },
      },
    });

    return { id: `group_${group.id}`, name: group.name };
  }


  async getUserRooms(userId: number) {
    // Fetch group rooms
    const groups = await this.prisma.groupMember.findMany({
      where: { userId },
      include: { group: true },
    });

    // Fetch 1-on-1 conversations
    const conversations = await this.prisma.conversation.findMany({
      where: { participants: { some: { id: userId } } },
    });

    const rooms = [
      { id: 'general', name: 'General' },
      ...groups.map(g => ({ id: `group_${g.groupId}`, name: g.group.name })),
      ...conversations.map(c => ({ id: `conversation_${c.id}`, name: `Chat ${c.id}` })),
    ];

    return rooms;
  }

  async getAllRooms() {
    const groups = await this.prisma.group.findMany(); // all group rooms
    const generalRoom = { id: 'general', name: 'General' };

    const rooms = [generalRoom, ...groups.map(g => ({ id: `group_${g.id}`, name: g.name }))];
    return rooms;
  }
  async getUserById(id: number){
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  async getMessagesByGroup(groupId: number) {
    return this.prisma.message.findMany({
      where: { groupId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
