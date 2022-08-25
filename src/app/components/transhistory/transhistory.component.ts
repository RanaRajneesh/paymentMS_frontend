import { OnInit ,AfterViewInit, Component, ViewChild, Input} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { Transaction } from 'src/transdatatypes';
import { TransactionService } from 'src/app/services/transaction-service.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transhistory',
  templateUrl: './transhistory.component.html',
  styleUrls: ['./transhistory.component.css']
})
export class TranshistoryComponent implements OnInit {

  tlist: Transaction[] =[];
  
  displayedColumns: string[] = ['id', 'senderAccountNumber', 'receiverAccountName', 'receiverAccountNumber', 'bic', 'amount','messageCode','transferType','timestamp'];

  dataSource!: MatTableDataSource<Transaction>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('table', { static: false }) table!: MatTable<any>;

  constructor(
    private transactionService: TransactionService,
    private router : Router){
      this.dataSource = new MatTableDataSource(this.tlist);
  } //Injecting the services in constructor


  // ngAfterViewInit() {
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    const subscription: Subscription = this.transactionService.getTransactions().subscribe(data => {
      console.log('SUCCESS', data);
      this.tlist = data as Transaction[];
      
      if (this.tlist) {
        this.dataSource = new MatTableDataSource(this.tlist);
        this.dataSource.paginator = this.paginator;
        this.table.renderRows();
      }
      subscription.unsubscribe();
    },
     (error) => {
        console.log('ERROR', error);
      }
    );
}


}

const tlistdummy: Transaction[] = [
  {
    transferFee:2,
    timestamp: new Date(),
    id: 1,
    transferType: "bank",
    messageCode: "REPA",
    bic: "VIN",
    senderAccountNumber: 1255,
    receiverAccountName: "SREE",
    receiverAccountNumber: 143,
    amount: 21200000
    
  },
  {
    id: 2,
    transferType: "bank",
    messageCode: "HOLD",
    amount: 30800000,
    senderAccountNumber: 1255,
    bic: "SREE",
    receiverAccountName: "VIN",
    receiverAccountNumber: 143,
    transferFee: 1 , 
    timestamp: new Date()
  }]