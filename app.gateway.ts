import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common'
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  BaseWsExceptionFilter
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { CreateUserArgs } from './user/args/user.args'
import { Catch, ArgumentsHost } from '@nestjs/common'

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host)
    const callback = host.getArgByIndex(2)
    callback({ err: { message: 'Internal Server Error' } })
  }
}

@WebSocketGateway({
  transports: ['websocket'],
  cors: { origin: 'http://localhost:4200', credentials: true }
})
export class AppGateway {
  @WebSocketServer()
  server: Server

  @UseFilters(new AllExceptionsFilter())
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: CreateUserArgs) {
    this.server.emit('message', message)
    return { data: 'ok' }
  }
}
