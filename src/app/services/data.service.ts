import { Injectable, numberAttribute } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, startWith, delay, Subject } from 'rxjs';
import { ApiDataWrapper } from './api-data-wrapper';
import { Account, AccountRole } from '../models/account.model';

export class DataServiceState {
  errorMessage?: string;
  isLoading: boolean = false;
}

@Injectable({
  providedIn: 'root'
})


export class DataService {
  baseUrl: string = "http://localhost:8081/api/v1";

  private _state = new BehaviorSubject<DataServiceState | null>(null);
  public state$ = this._state.asObservable();

  private _account = new BehaviorSubject<Account | null>(null);
  public account$ = this._account.asObservable();
  private _accountLastUserName: string | null = null;

  private _isSignInSuccess = new BehaviorSubject<boolean | null>(null);
  public isSignInSuccess$ = this._isSignInSuccess.asObservable();
  private _isSignUpSuccess = new BehaviorSubject<boolean | null>(null);
  public isSignUpSuccess$ = this._isSignUpSuccess.asObservable();


  errorMessageUnexpected:string = "Unexpected server error";

  constructor(private httpClient: HttpClient) {
  }

  // Constructor
  // --------------------------
  // Account
  public  getAccountLastUserName() : string | null {
    return this._accountLastUserName;
  }
  public postSignIn(account: Account) {
    console.log(account);
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_in', account, { withCredentials: true, })
      .pipe(
        map((account) => ({ data: account, state: {errorMessage: undefined, isLoading: false }})),
        catchError((err) => of({ data: undefined, state: {errorMessage: err.error?.message != undefined ? err.error.message : this.errorMessageUnexpected, isLoading: false }})),
        startWith({ data: undefined, state: {errorMessage: undefined, isLoading: true } })
      ).subscribe((pipeData) => {
        this._state.next(pipeData.state);
        if (pipeData.data != undefined) {
          this._account.next(pipeData.data);
          this._isSignInSuccess.next(true);
          this._accountLastUserName = pipeData.data.username;
        } else {
          this._account.next(null);
        }
      });
  }
  public postSignUp(account: Account) {
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_up', account, {withCredentials: true,})
      .pipe(
        map((account) => ({ data: account, state: {errorMessage: undefined, isLoading: false }})),
        catchError((err) => of({ data: undefined, state: {errorMessage: err.error?.message != undefined ? err.error.message : this.errorMessageUnexpected, isLoading: false }})),
        startWith({ data: undefined, state: {errorMessage: undefined, isLoading: true } })
      ).subscribe((pipeData) => {
        this._state.next(pipeData.state);
        if (pipeData?.data?.username) {
          this._isSignUpSuccess.next(true);
          this._accountLastUserName = pipeData.data.username;
        }
      });
  }
  public postSignOut() {
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_out', null, {withCredentials: true,})
      .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err.error?.message != undefined ? err.error.message : this.errorMessageUnexpected, isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})        
      ).subscribe((account) => {
        this._account.next(null);
      });
  }
  public rereadAccount() {
    this.httpClient
      .get<Account>(this.baseUrl + '/auth/account', {withCredentials: true})
      .pipe(
        map((account) => ({ data: account, state: {errorMessage: undefined, isLoading: false }})),
        catchError((err) => of({ data: undefined, state: {errorMessage: undefined, isLoading: false }})),
        startWith({ data: undefined, state: {errorMessage: undefined, isLoading: true } })
      ).subscribe((pipeData) => {
        this._state.next(pipeData.state);
        if (pipeData.data != undefined) {
          this._account.next(pipeData.data);
        } else {
          this._account.next(null);
        }
      });
  }
  // Account
  // --------------------------
}
