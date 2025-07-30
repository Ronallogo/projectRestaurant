import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/servicies/product.service';
import { SnackbarService } from 'src/app/servicies/snackbar.service';
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
import { Action } from 'rxjs/internal/scheduler/Action';
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { CategoryService } from 'src/app/servicies/category.service';

@Component({
  selector: 'app-manage-product',
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
    ProductComponent
  ],
  providers : [ProductComponent] , 
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss',
})
export class ManageProductComponent {
  displayedColumns: string[] = [
    'name',
    'categoryName',
    'description',
    'price',
    'edit',
  ];
  dataSource: any;
  responseMessage: any;
  ProductForm: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';
 // responseMessage: any;
  categories: {id : number , name : string}[] = [];
    //length1:any;

  constructor(
    private productService: ProductService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
   private cdr: ChangeDetectorRef ,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData(); 
    this.getCategories();
      this.ngxService.stop();
  } 

    getCategories() {
      this.categoryService.getCategories().subscribe(
        (response:any) => {
          console.log('Catégories récupérées:', response);
          this.categories = response;
        //  this.cdr.detectChanges(); // Forcer la détection des changements
        },
        (error:any) => {
          //this.dialogRef.close();
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

  tableData() {
    
   
    this.productService.getProducts().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
      },
      (error: any) => {
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

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Ajouter',
    }
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });


    const sub = dialogRef.componentInstance.onAddProduct.subscribe(
      (response) => {
        this.tableData();
      }
    );
  }


  handleEditAction(values: any) {
  const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values,
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onEditProduct.subscribe(
      (response) => {
        this.tableData();
      }
    );
  }


  handleDeleteAction(values: any) {
   const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'supprimer le produit ' + values.name ,
      confirmation: true,
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (response) => {
        this.ngxService.start();
        this.deleteProduct(values.id);
        dialogRef.close();
      }
    );
  }

  deleteProduct(id: any) {
  this.productService.delete(id).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.tableData();
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

  onChange(status:any, id: any) {
   this.ngxService.start();
    var data = {
      status: status.toString(),
      id: id
    }

    this.productService.updateStatus(data).subscribe(
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
}
