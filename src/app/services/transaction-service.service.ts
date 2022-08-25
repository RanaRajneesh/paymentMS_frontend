import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Transaction } from 'src/transdatatypes';

@Injectable({
  providedIn: 'root'
})
export class TransactionService{

  private transUrl: string;
  constructor(private httpClient: HttpClient) { 
    this.transUrl = 'http://localhost:8060/api/';
  }

  getTransactions() {
    return this.httpClient.get(this.transUrl + "transactions");
  }

  public findAll(): Observable<Transaction[]> {
    return this.httpClient.get<Transaction[]>(this.transUrl);
  }
  public save(trans: Transaction) {
    return this.httpClient.post<Transaction>(this.transUrl, trans);
  }
}
