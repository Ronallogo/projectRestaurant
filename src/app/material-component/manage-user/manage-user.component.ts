import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/servicies/snackbar.service';
import { UserService } from 'src/app/servicies/user.service';
import { GlobalContants } from 'src/app/shared/global-constants';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card'; 
import { MatTableModule } from '@angular/material/table';
import { RouteGuardService } from 'src/app/servicies/route-guard.service';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    FlexLayoutModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
  ],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.scss',
})
export class ManageUserComponent {
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'status'];
  dataSource: any;
  responseMessage: any;
  emailUser : string = "" ; 

   

  constructor(
    private userService: UserService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService  , 
    private  gard : RouteGuardService
  ) {}

  ngOnInit(): void {
    this.emailUser = this.gard.userEmail ; 
    console.log(this.emailUser);
    this.ngxService.start();
    this.tableData();
  }


  
  tableData() {
    this.userService.getUsers().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
        console.log(this.dataSource);
      },
      (error) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalContants.genericError;
        }
        this.snackbarService.openSnackbar(
          this.responseMessage,
          GlobalContants.error
        );
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onChange(status: any, id: any) {
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id: id
    }

    this.userService.update(data).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackbar(this.responseMessage, 'succès');
      },
      (error: any) => {
        this.ngxService.stop();
        console.log(error);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalContants.genericError;
        }
        this.snackbarService.openSnackbar(
          this.responseMessage,
          GlobalContants.error
        );
      }
    );
  }




  changeState(id : number){
    console.log(id);
      this.ngxService.start() ; 
      this.userService.changeState(id).subscribe(response=>{
          this.snackbarService.openSnackbar("etat modifié avec succès", 'succès');
          console.log(response);
          this.tableData();
      } , error =>   console.log(error)) ; 

      this.ngxService.stop() ; 

  }


  delete(id : number){
      this.ngxService.start() ; 
      this.userService.delete(id).subscribe(response=>{
          this.snackbarService.openSnackbar("utilisateur supprimé avec succès", 'succès');
          console.log(response);
          this.tableData();

      } , error =>   console.log(error)) ; 

      this.ngxService.stop() ; 
  }
}
