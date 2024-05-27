import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'status-update',
  cors: '*',
})
export class StudentGateway {
  private logger: Logger = new Logger(StudentGateway.name);

  @WebSocketServer()
  server;

  handleConnection(client: Socket, ..._args: any[]) {
    this.logger.log(
      `WS Client ${client.id} connected to status-update namespace`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(
      `WS Client ${client.id} disconnected from status-update namespace`,
    );
  }

  async emitNotification(message: string) {
    this.server.emit('notification', message);
  }
}
