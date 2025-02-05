import { Injectable } from '@angular/core';
import { Account } from '../models/account.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, startWith, Subject } from 'rxjs';
import { ApiDataWrapper } from './api-data-wrapper';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  baseUrl:string = "http://localhost:8081/api/v1";
  private _authInProgress = new BehaviorSubject<boolean>(false);
  private _accountSubject = new Subject<ApiDataWrapper<Account> | null>();
  private _account = new BehaviorSubject<ApiDataWrapper<Account> | null>(null);
  public account$ = this._account.asObservable();
  public authInProgress$ = this._authInProgress.asObservable();

  constructor(private httpClient: HttpClient, private router: Router) {
  }
  
  public isAuthenticated() : Observable<boolean> {
    if (this._account.value != null && this._account.value.data != undefined)
      return of(this._account.value.data.role != null);

    return this.getAccount().pipe(
      map((account) => {
        return account?.data?.role != null;
      }));
  }
  
  public getAccount() : Observable<ApiDataWrapper<Account> | null> {
    this.httpClient
      .get<Account>(this.baseUrl + '/auth/account', {withCredentials: true})
      .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false})),
      )
      .subscribe((account) => {
        this._account.next(account);
        this._accountSubject.next(account);
      });
    return this._accountSubject.asObservable();
  }  
 
  public postSignIn(username:String, password:String) : Observable<ApiDataWrapper<Account> | null> {
    this._authInProgress.next(true);
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_in', {username: username, password: password}, {withCredentials: true,})
      .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false})),
        startWith({isLoading: true})
      ).subscribe((account) => {
        this._account.next(account);
        this._accountSubject.next(account);
        this._authInProgress.next(false);
      });
    return this._accountSubject.asObservable();
  }

  public postSignUp(username:String, password:String) : Observable<ApiDataWrapper<Account> | null> {
    this._authInProgress.next(true);
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_up', {username: username, password: password}, {withCredentials: true,})
      .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false}))
      ).subscribe((account) => {
        this._accountSubject.next(account);
        this._authInProgress.next(false);
      });
    return this._accountSubject.asObservable();
  }

  public postSignOut() {
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_out', null, {withCredentials: true,})
      .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false}))
      ).subscribe((account) => {
        this._account.next(null);
        this.router.navigate(["/"]);
      });
  }
  public postNewSession() : Observable<ApiDataWrapper<Account> | null> {
    this._authInProgress.next(true);
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/new_session', null, {withCredentials: true,})
      .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false}))
      ).subscribe((account) => {
        this._account.next(account)
        this._accountSubject.next(account);
        this._authInProgress.next(false);
      });
    return this._accountSubject.asObservable();
  }
}
