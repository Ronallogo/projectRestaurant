import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../servicies/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../servicies/snackbar.service';
import { GlobalContants } from '../shared/global-constants';
import { error } from 'console';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    FlexLayoutModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  forgotPasswordForm:any = FormGroup;
  responseMessage:any;


  constructor(private formBuilder:FormBuilder,
    private userService:UserService,
    public dialogRef:MatDialogRef<ForgotPasswordComponent>,
    private ngxService:NgxUiLoaderService,
    private snackbarService:SnackbarService
  ){

  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email : [null, [Validators.required, Validators.pattern(GlobalContants.emailRegex)]]
    });
    
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.forgotPasswordForm.value;
    var data = {
      email:formData.email
  
    }
    this.userService.forgotPassword(data).subscribe((response:any)=>{
      this.ngxService.stop;
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackbar(this.responseMessage,"")
    }, (error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalContants.genericError;
      }
      this.snackbarService.openSnackbar(this.responseMessage, GlobalContants.error);
    })

  }

}
