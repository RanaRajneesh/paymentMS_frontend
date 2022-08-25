import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable,of } from 'rxjs';
import { Bank, Customer, TransactionRequest, TransactionResponse } from 'src/transdatatypes';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  private baseUrl: string;
  private transUrl : string;
  constructor(private httpClient: HttpClient) { 
    this.baseUrl = 'http://localhost:8060/api/';
    this.transUrl = 'http://localhost:8060/api/transaction/';
  }

  getAllCustomers() {
    return this.httpClient.get(this.baseUrl + "customer/allCustomerAccounts");
  }

  getCustomerDataById(cid: string): Observable<Customer> {
    return this.httpClient.get<Customer>(this.baseUrl + "customer/" + cid);
  }

  getBankByBIC(bic: string): Observable<Bank> {
    return this.httpClient.get<Bank>(this.baseUrl + "bank/" + bic)
  }

  //Save transaction
  public saveTransaction(savedata: TransactionRequest) : Observable<any> {
    console.log(savedata);
    return this.httpClient.post<TransactionRequest>(this.transUrl , savedata);
  }

  getLastTransaction(): TransactionResponse {
    return <TransactionResponse>JSON.parse(localStorage.getItem('lastMade') || 'false');
  }


  transactionRequest(transactionRequest: TransactionRequest): Observable<TransactionResponse> {
    return this.httpClient.post<TransactionResponse>(this.baseUrl + "transaction", transactionRequest).pipe(
      map(res => {
        localStorage.setItem('lastMade', JSON.stringify(res));
        return res;
      })
    )
  }

  public findAll(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>(this.baseUrl);
  }

  public save(cdata: Customer) {
    return this.httpClient.post<Customer>(this.baseUrl, cdata);
  }
}
