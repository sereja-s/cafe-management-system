import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'edit'];
  dataSource: any; //for storing all the data that we get from the backend whenever a API is hit
  responseMessage: any;
  constructor(private categorySevice: CategoryService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();   //we'll call this method whenever the page is going to load
  }

  //creating the table() method
  tableData() {
    this.categorySevice.getCategory().subscribe((response: any) => {       //calling the API, we dont have to pass any data in this API
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);     //whatever data we get in response, we'll directly pass it to the data source
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);    //at last we'll display the message
    })
  }

  //we also have a filter. To display data on the basis of this filter on table. Creating a method for the same
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    //when we subscribe to the category page to get an error status code like 401 or 403, we get routed to the login page, but the model doesn't close. So to close that model we have to write a code
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    //whenever we press the submit button, this:- this.onAddCategory.emit(); , will be called. So in this case we need to referesh our table. So, writing code for the same.
    const sub = dialogRef.componentInstance.onAddCategory.subscribe(
      (response) => {
        this.tableData();
      }
    )
  }

  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values         //we also have to pass the data here, it'll pass the value inside data, for eg, name of category need to be edited
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    //when we subscribe to the category page to get an error status code like 401 or 403, we get routed to the login page, but the model doesn't close. So to close that model we have to write a code
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    //whenever we press the submit button, this:- this.onAddCategory.emit(); , will be called. So in this case we need to referesh our table. So, writing code for the same.
    const sub = dialogRef.componentInstance.onEditCategory.subscribe(
      (response) => {
        this.tableData();
      }
    )
  }

}





