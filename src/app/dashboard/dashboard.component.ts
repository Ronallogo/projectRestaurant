import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DashboardService } from '../servicies/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../servicies/snackbar.service';
import { GlobalContants } from '../shared/global-constants';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  responseMessage: any;
  data: any;

  constructor(
    private dashboardService: DashboardService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {}


  ngOnInit(): void{
    console.log('ngOnInit() appelé'); 
    this.ngxService.start();
    this.dashboardData();
  }


  dashboardData() {
    console.log('dashboardData() appelée'); 
    this.dashboardService.getDetails().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.data = response;
        console.log('Données du DashBoard :', this.data);
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
}
