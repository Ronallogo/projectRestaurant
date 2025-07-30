import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
     MatIconModule,
     MatDialogModule,
     MatToolbarModule,
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {


  onEmitStatusChange = new EventEmitter();
  details:any= {};
  
  constructor(@Inject (MAT_DIALOG_DATA) public dialogData:any){}

  ngOnInit(): void {
    if(this.dialogData && this.dialogData.confirmation){
      this.details = this.dialogData;
    }
  }

  handleChangeAction(){
    this.onEmitStatusChange.emit();
  }

}
