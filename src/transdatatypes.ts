// custom data type definitions here
export type Transaction = {
    id: number;
    transferType: string;
    messageCode: string;
    amount: number;
    senderAccountNumber: number;
    bic: string;
    receiverAccountName: string;
    receiverAccountNumber: number;
    transferFee: number;
    timestamp: Date;
  };


  export type Customer = {
    account_number: string;
    clearBalance: number;
    name: string;
    overdraft: boolean;
  }

  export type Bank = {
    bic: string;
    name: string;
  }
  

  export type TransactionRequest =  {
    senderAccountNumber: string;
    amount: number;
    messageCode: string;
    receiverAccountNumber: string;
    receiverAccountName: string;
    bic: string;
    transferType: string;
  }

  

export interface TransactionResponse {
  sender: {
    account_number: string;
    name: string;
    clearBalance: number;
    overdraft: boolean
  },
  transaction: {
    transferFee: number;
    totalAmount: number;
    transferType : string
  },
  date: Date;
  bic: string;
  receiverAccountNumber: string;
  receiverAccountName: string;
  messageCode: string;
}