import { Component, OnDestroy, OnInit } from '@angular/core'
import { Socket } from 'ngx-socket-io'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'socket-client'
  socketSub!: Subscription
  messages: string[] = []

  constructor(private socket: Socket) {}

  ngOnInit() {
    this.socketSub = this.socket.fromEvent<string>('message').subscribe(
      (message: string) => {
        console.log('message channel', message)
        this.messages.push(message)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  send() {
    this.socket.emit('message', (Math.random() * 10 ** 10).toString(16), (res: any) => {
      console.log('response error or data', res)
    })
  }

  ngOnDestroy() {
    this.socketSub.unsubscribe()
  }
}
