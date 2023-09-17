// import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

// @WebSocketGateway()
// export class EventsGateway {
//   @SubscribeMessage('message')
//   handleMessage(client: any, payload: any): string {
//     return 'Hello world!';
//   }
// }

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  ConnectedSocket,
  MessageBody

} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ListNewsDto } from 'src/news/dtos/listNews.dto';
import { NewsService } from 'src/news/services/news.service';
@WebSocketGateway(3002, {
  path: '/',
  serveClient: true,
  transports: [
    'websocket'
  ]
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private readonly timestamp = Date.now();
  constructor( private newsService: NewsService){}

  @SubscribeMessage('pullNews')
  async pullNews(@MessageBody() data: any) {
    console.log("event pull News", data);
    const clientId = data.clientId;
    delete data.clientId;
  
    const result = await this.newsService.listNews(data);

    // join room, emit to client room
    this.server.to(clientId).emit('pullNews', result)
  }

  public afterInit(server: any): any {
    console.log(`init...`);
  }

  handleConnection(
    @ConnectedSocket()
    client: Socket, ...args: any
    ): any {
    console.log(`connected... id: ${client.id}`);
      
    // user-userId
    client.join(client.id);
  }

  handleDisconnect(client: any): any {
    console.log(`disconnect... id: ${client.id}`);
  }
}
