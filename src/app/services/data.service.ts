import { Injectable, numberAttribute } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, startWith, delay, Subject } from 'rxjs';
import { ApiDataWrapper } from './api-data-wrapper';
import { Account, AccountRole } from '../models/account.model';
import { Project } from '../models/project.model';

export class DataServiceState {
  errorMessage?: string;
  isLoading: boolean = false;
}

@Injectable({
  providedIn: 'root'
})


export class DataService {
  baseUrl: string = "http://localhost:8081/api/v1";

  private _isLoading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this._isLoading.asObservable();
  private _errorMessage = new BehaviorSubject<string|null>(null);
  public errorMessage$ = this._errorMessage.asObservable();

  private _account = new BehaviorSubject<Account | null>(null);
  public account$ = this._account.asObservable();
  private _accountLastUserName: string | null = null;

  private _isSignInSuccess = new BehaviorSubject<boolean | null>(null);
  public isSignInSuccess$ = this._isSignInSuccess.asObservable();
  private _isSignUpSuccess = new BehaviorSubject<boolean | null>(null);
  public isSignUpSuccess$ = this._isSignUpSuccess.asObservable();

  private _projects = new BehaviorSubject<Project[]>([]);
  public projects$ = this._projects.asObservable();

  errorMessageUnexpected:string = "Unexpected server error";

  constructor(private httpClient: HttpClient) {
  }

  static readonly  stateErrorNoIsLoadingFalse = {errorMessage: undefined, isLoading: false };
  static readonly  stateErrorNoIsLoadingTrue = {errorMessage: undefined, isLoading: true };

  // Constructor
  // --------------------------
  // Errors
  public getErrorMessage(error: any) : string | null {
    return error.error?.message != undefined ? error.error.message : this.errorMessageUnexpected;
  }
  // Errors
  // --------------------------
  // Account
  public  getAccountLastUserName() : string | null {
    return this._accountLastUserName;
  }
  public doPostSignIn(account: Account) {
    console.log(account);
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_in', account, { withCredentials: true, })
      .pipe(
        map((account) => (new ApiDataWrapper(account, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))
      ).subscribe((pipeData) => {
        this._isLoading.next(pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (pipeData.data != undefined) {
          this._account.next(pipeData.data);
          this._isSignInSuccess.next(true);
          this._accountLastUserName = pipeData.data.username;
        } else {
          this._account.next(null);
        }
      });
  }
  public doPostSignUp(account: Account) {
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_up', account, {withCredentials: true,})
      .pipe(
        map((account) => (new ApiDataWrapper(account, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))
      ).subscribe((pipeData) => {
        this._isLoading.next(pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (pipeData?.data?.username) {
          this._isSignUpSuccess.next(true);
          this._accountLastUserName = pipeData.data.username;
        }
      });
  }
  public doPostSignOut() {
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_out', null, {withCredentials: true,})
      .pipe(
        map((account) => (new ApiDataWrapper(account, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))     
      ).subscribe((pipeData) => {
        this._isLoading.next(pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        this._account.next(null);
      });
  }
  public rereadAccount() {
    this.httpClient
      .get<Account>(this.baseUrl + '/auth/account', {withCredentials: true})
      .pipe(
        map((account) => (new ApiDataWrapper(account, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))  
      ).subscribe((pipeData) => {
        this._isLoading.next(pipeData.isLoading);
        // Hide reread errors
        // this._errorMessage.next(pipeData.errorMessage);
        if (pipeData.data != undefined) {
          this._account.next(pipeData.data);
        } else {
          this._account.next(null);
        }
      });
  }
  // Account
  // --------------------------
  // Projects
  // public getProjects() {
  //   return this._projects.getValue();
  // }  
  public doGetProjects() {
    this.httpClient
      .get<Project[]>(this.baseUrl + '/projects', {withCredentials: true})
      .pipe(
        map((projects) => (new ApiDataWrapper(projects, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))  
      )
      .subscribe((pipeData) => {
        this._isLoading.next(pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (!pipeData.isLoading && pipeData.data)     
          this._projects.next(pipeData.data);
      });
  }
  // --------------------------


}
