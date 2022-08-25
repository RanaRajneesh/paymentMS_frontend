import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import {StepperOrientation} from '@angular/material/stepper';
import {Observable, of, Subscription} from "rxjs";
import {map} from 'rxjs/operators';
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import { Customer, TransactionRequest } from 'src/transdatatypes'; 

import {ErrorStateMatcher} from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerServiceService } from 'src/app/services/customer-service.service';
import { HttpClient } from '@angular/common/http';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

interface MsgCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class HomeComponent implements OnInit {

  senderFormGroup: FormGroup
  receiverFormGroup: FormGroup
  paymentFormGroup: FormGroup
  
  stepperOrientation: Observable<StepperOrientation>;
    
  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private customerServiceService: CustomerServiceService,
    private _formBuilder: FormBuilder, 
    breakpointObserver: BreakpointObserver,
    private router : Router) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));

      this.senderFormGroup = this._formBuilder.group({
        accountNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20),]],
        accountName: [{value: '', disabled: true}],
        clearBalance: [{value: '', disabled: true}]
      });
      this.receiverFormGroup = this._formBuilder.group({
        receiverAccountNumber: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(20)]],
        receiverAccountName: ['', Validators.required],
        bic: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
        receiverBankName: [{value: '', disabled: true}]
      });
      this.paymentFormGroup = this._formBuilder.group({
        transferType: ['', Validators.required],
        messageCode: ['', Validators.required],
        currencyCode: ['', Validators.required],
        amount: ['', Validators.required],
        totalAmount: [{value: 0, disabled: true}]
      });
  }
  
  selectedValue = new FormControl('', [Validators.required, Validators.pattern('customerTrans')]);
  selectedValue2: string ="";

  msgcodes: MsgCode[] = [
    {value: 'CHQB', viewValue: 'CHQB'},
    {value: 'CORT', viewValue: 'CORT'},
    {value: 'HOLD', viewValue: 'HOLD'},
    {value: 'INTC', viewValue: 'INTC'},
    {value: 'PHOB', viewValue: 'PHOB'},
    {value: 'PHOI', viewValue: 'PHOI'},
    {value: 'PHON', viewValue: 'PHON'},
    {value: 'REPA', viewValue: 'REPA'},
    {value: 'SDVA', viewValue: 'SDVA'},
  ];
  matcher = new MyErrorStateMatcher();

  currencyCodes = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
  selectedValue3:string ="INR";
  amountvalue: number = 0;
  digits=".2";
  code="INR";

  
  ngOnInit(): void {
    this.getBankDetails1();
  }

  updatedamount:string="";
  updatedamountno=0;
  lastTransaction = this.customerServiceService.getLastTransaction();


  onSubmit() {
    this.updatedamount = (<HTMLInputElement>document.getElementById("vin")).value;
    this.updatedamountno= Number(this.updatedamount.replace(/,/g, ''));
    

    const {
      accountNumber = '',
      amount = 0,
      messageCode = '',
      receiverAccountName = '',
      receiverAccountNumber = '',
      bic = '',
      transferType = ''
    } = {...this.paymentFormGroup.value, ...this.senderFormGroup.value, ...this.receiverFormGroup.value}

    const transactionRequest: TransactionRequest = {
      senderAccountNumber: accountNumber,
      amount :  this.updatedamountno,
      messageCode,
      receiverAccountName,
      receiverAccountNumber,
      bic,
      transferType
  }
    this.customerServiceService.saveTransaction(transactionRequest).subscribe(
      result =>{
      console.log("Result:", result);
      window.alert(result.msg);
      if(result.msg == "Transfer successfull") this.gotoTransactionList()
      },
      (error) => {
        window.alert(error.error.msg);
        console.log('ERROR', error.error);
      }
    );
  } 

  gotoTransactionList() {
    this.router.navigate(['/transhistory']);
  }

  getcustomerDetails(){
    if (this.senderFormGroup.valid){
        const subscription1: Subscription = this.customerServiceService.getCustomerDataById(this.senderFormGroup.value.accountNumber).subscribe(value => {
        console.log('CD SUCCESS', value, this.senderFormGroup.value.accountNumber);
        this.senderFormGroup.get('accountName')?.setValue(value.name);
        this.senderFormGroup.get('clearBalance')?.setValue(value.clearBalance);
        subscription1.unsubscribe();
      }, (error) => {
        console.log('ERROR', error);
      });
    }else{
      console.log("Invalid");
      this.senderFormGroup.reset();
    }
  }
  


  getBankDetails(){
    if (this.receiverFormGroup.valid){
      const subscription1: Subscription = this.customerServiceService.getBankByBIC(this.receiverFormGroup.value.bic).subscribe(value => {
      console.log('BD SUCCESS', value, this.receiverFormGroup.value.bic);
      this.receiverFormGroup.get('receiverBankName')?.setValue(value.name);
      subscription1.unsubscribe();
    }, (error) => {
      console.log('ERROR', error);
    });
  }else{
    console.log("Invalid");
    this.senderFormGroup.reset();
  }
  }

  getBankDetails1() {
    const subscription: Subscription = this.customerServiceService.getBankByBIC("ACBLINBBXXX").subscribe(data => {
      console.log('SUCCESS', data);
      // this.treq = data as Transaction[];
      subscription.unsubscribe();
    },
     (error) => {
        console.log('ERROR', error);
      }
    );
  }

}
