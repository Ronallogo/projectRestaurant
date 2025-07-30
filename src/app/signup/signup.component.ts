import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../servicies/user.service';
import { SnackbarService } from '../servicies/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalContants } from '../shared/global-constants';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-signup',
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
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  password = true;
  confirmPassword = true;
  signupForm!: FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    public dialogReference: MatDialogRef<SignupComponent>,
    private ngxservice: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
        name: [null, [Validators.required, Validators.pattern(GlobalContants.nameRegex)]],
        email: [null, [Validators.required, Validators.pattern(GlobalContants.emailRegex)]],
        contactNumber: [null, [Validators.required, Validators.pattern(GlobalContants.contactNumberRegex)]],
        password: [null, [Validators.required]],
        confirmPassword: [null, [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  validateSubmit() {
    return this.signupForm.invalid || this.signupForm.hasError('mismatch');
  }

  handleSubmit() {
    console.log('handleSubmit called');
    if (this.validateSubmit()) {
      this.snackbarService.openSnackbar("Veuillez corriger les erreurs avant de soumettre.", GlobalContants.error);
      return;
    }

    this.ngxservice.start();
    const formData = this.signupForm.value;
    const data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    };

    this.userService.signup(data).subscribe(
      (response: any) => {
        console.log(response);
        this.ngxservice.stop();
        this.dialogReference.close();
       this.responseMessage = response?.message;
        this.snackbarService.openSnackbar(this.responseMessage, '');
        this.router.navigate(['/']);
      },
      (error) => {
        this.ngxservice.stop();
        this.responseMessage = error.error?.message || GlobalContants.genericError;
        this.snackbarService.openSnackbar(this.responseMessage, GlobalContants.error);
      }
    );
  }
}
