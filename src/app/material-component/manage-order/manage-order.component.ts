import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/servicies/bill.service';
import { CategoryService } from 'src/app/servicies/category.service';
import { ProductService } from 'src/app/servicies/product.service';
import { SnackbarService } from 'src/app/servicies/snackbar.service';
import { GlobalContants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { NgClass } from '@angular/common';



@Component({
  selector: 'app-manage-order',
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
    MatSelectModule,
    NgClass
  ],
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.scss',
})
export class ManageOrderComponent {
  displayedColumns: string[] = [
    'name',
    'category',
    'price',
    'quantity',
    'total',
    'edit',
  ];

  dataSource: any = [];
   manageOrderForm: any = FormGroup;
  categories: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;
  categoryControl = new FormControl();


  constructor(
    @Inject(FormBuilder)private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private billservice: BillService,
   private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {

    this.manageOrderForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalContants.nameRegex)],
      ],
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalContants.emailRegex)],
      ],
      contactNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(GlobalContants.contactNumberRegex),
        ],
      ],
     
      paymentMethod: [null, [Validators.required]],
   
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
    });
     this.ngxService.start();
    this.getCategories();
  }

getCategories() {
    this.categoryService.getFilteredCategories().subscribe(
      (reponse: any) => {
        this.ngxService.stop();
        this.categories = reponse || [];
  console.log('Réponse brute des catégories :', reponse);



        this.cdr.detectChanges(); // Force le rafraîchissement de l'interface
        console.log(this.categories);
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

    console.log('Formulaire initialisé :', this.manageOrderForm);
    console.log('Catégories au démarrage :', this.categories);

  }





  testFunction(event: any) {
    console.log('L’événement selectionChange est déclenché :', event);
  }

  debugMessage(message: string) {
    console.log(message);
  }



  getProductsByCategory(value: { id: number; name: string }) {
    console.log('Appel API pour obtenir les produits avec category ID:', value.id);
    this.productService.getProductsByCategory(value.id).subscribe(
      (response: any) => {
        this.products = response;
        console.log(this.products);
        this.manageOrderForm.controls.price.setValue('');
        this.manageOrderForm.controls.quantity.setValue('');
        this.manageOrderForm.controls.total.setValue(0);
      },
      (error: any) => {
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


  getProductDetails(value: { id: number; name: string }) {
    this.productService.getById(value.id).subscribe(
      (response: any) => {
        this.price = response.price;
        this.manageOrderForm.controls['price'].setValue(response.price);
        this.manageOrderForm.controls['quantity'].setValue('1');
        this.manageOrderForm.controls['total'].setValue(this.price * 1);
      },
      (error: any) => {
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

onCategoryChange(categoryId: number) {
  const selectedCategory = this.categories.find((c: any) => c.id == categoryId);
  this.manageOrderForm.controls['category'].setValue(selectedCategory);
  if (selectedCategory) {
    this.getProductsByCategory(selectedCategory);
  }
}

onProductChange(productId: number): void {
  const selectedProduct = this.products.find((p: any): boolean => p.id === productId);
  this.manageOrderForm.controls['product'].setValue(selectedProduct);
  if (selectedProduct) {
    this.getProductDetails(selectedProduct);
  }
}



  setQuantity(value: any) {
    var temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value *
          this.manageOrderForm.controls['price'].value
      );
    } else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value *
          this.manageOrderForm.controls['price'].value
      );
    }
  }

  validateProductAdd() {
  /*  if (
      this.manageOrderForm.controls['total'].value === 0 ||
      this.manageOrderForm.controls['total'].value === null ||
      this.manageOrderForm.controls['quantity'].value <= 0
    ) {
      return true;
    } else {
      return false;
    }*/

    return (
     ( this.manageOrderForm.controls.name.invalid  )||
     ( this.manageOrderForm.controls.email.invalid  )||
     ( this.manageOrderForm.controls.contactNumber.invalid  )||
     ( this.manageOrderForm.controls.name.invalid  )||
     ( this.manageOrderForm.controls.name.invalid  )||
     ( this.manageOrderForm.controls.name.invalid )
    ) ; 
  }

  validateSubmit() {
    if (
      this.totalAmount === 0 ||
      this.manageOrderForm.controls.name.value === null ||
      this.manageOrderForm.controls['email'].value === null ||
      this.manageOrderForm.controls['contactNumber'].value === null ||
      this.manageOrderForm.controls['paymentMethod'].value === null
    ) {
      return true;
    } else {
      return false;
    }
  }

  add() {
    var formData = this.manageOrderForm.value;

    console.log(this.manageOrderForm.value);

    var productName = this.dataSource.find(
      (e: { id: Number }) => e.id === formData.product.id
    );
    if (productName === undefined) {
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({
        id: formData.id,
        name: formData.product.name,
        
        category: formData.category.name,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total,
      });
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackbar(GlobalContants.productAdded, 'succès');
    } else {
      this.snackbarService.openSnackbar(
        GlobalContants.productExitsError,
        GlobalContants.error
      );
    }
  }

  handleDeleteAction(value: any, element: any) {
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }

  submitAction() {
    let formData = this.manageOrderForm.value;
    let data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount.toString(),
      productDetails: JSON.stringify(this.dataSource),
    }

    this.ngxService.start();
    this.billservice.generateReport(data).subscribe(
      (response: any) => {
        this.downloadFile(response?.uuid);
        this.manageOrderForm.reset();
        this.dataSource = [];
        this.totalAmount = 0;
      },
      (error: any) => {
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


  downloadFile(fileName: string) {
    var data = {
      uuid: fileName,
    };
    this.billservice.getPdf(data).subscribe((response: any) => {
      saveAs(response, fileName + ' pdf');
      this.ngxService.stop();
    });
  }
}


