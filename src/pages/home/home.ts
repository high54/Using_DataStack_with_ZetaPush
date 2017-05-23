import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// ZMS
import { ClientProvider } from '../../providers/client-provider';
import { StackProvider } from '../../providers/stack-provider';
import { services } from 'zetapush-js';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
  private tabs:any[]=new Array<any>();
    private stackService = this.client.getInstance().createAsyncMacroService({
        Type: StackProvider
    }) as StackProvider;

    private msg:string="";


    constructor(public navCtrl: NavController, public client: ClientProvider) {
        this.client.getInstance().connect();
        this.connect();
    }
    connect() {
        this.client.getInstance().addConnectionStatusListener({
            onConnectionEstablished: () => {
                var self = this;
                var stackService2 = this.client.getInstance().createService({
                    Type: services.Stack,
                    listener: {
                      push(message) {self.tabs.unshift(message.data.data.Message)
                      console.log(self.tabs)}
                    }
                });
            },
            onFailedHandshake: error => {
                console.error(error)
            },
            onConnectionClosed: () => {
                this.client.getInstance().connect();
            }
        });
    }
    sendMsg() {
        this.stackService.stackPush(this.msg).then((result) => {
            this.msg ="";
        }).catch((error) => {
            console.error(error);
        })
    }
    getMsg() {
        this.stackService.stackList().then((result) => {
            console.log(result);
            this.tabs = result.list.result.content;
            console.log(this.client.getInstance().getUserId())
        }).catch((error) => {
            console.error(error);
        })
        this.stackService.stackGetListeners().then((result)=>
      {
        console.log(result)
      }).catch((error)=>{
        console.error(error)
      })
    }
    join()
    {
      this.stackService.stackSetListeners(this.client.getInstance().getUserId()).then((result)=>
    {
      console.log(result);
    }).catch((error)=>
  {
    console.error(error);
  })
    }
}
