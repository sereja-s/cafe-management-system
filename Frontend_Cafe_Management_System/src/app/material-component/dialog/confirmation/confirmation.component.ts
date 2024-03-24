import { Component, OnInit, EventEmitter, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  onEmitStatusChange = new EventEmitter();
  details:any ={};    //this is actually a model/dialog, so it'll open as a popup whenever we click something
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any) { }       //in that case we also need to pass data from 1 dialog to another dialohg, or 1 page to some other dialog, in  that case we also need to pass/insert some data
  
  ngOnInit(): void {
    if(this.dialogData){
      this.details = this.dialogData;
    }
  }
  //this a popup model/dialog asking user for confirmation, are u sure u want to log out
  //let's say some user clicked on 'yes', so in order to handle that

  handleChangeAction(){   //whenever we trigger this page, we'll get that 
    this.onEmitStatusChange.emit(); //this one has been emitted, it means that it selected 'yes', in that case we'll move forword, otherwise the process will be stopped, for that case we are using this one
  }

}
