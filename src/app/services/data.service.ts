import { Injectable } from '@angular/core';
import { Account, AccountRole } from '../models/account.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, delay, map, Observable, Observer, of, ReplaySubject, startWith, Subject, tap, throwError } from 'rxjs';
import { ApiDataWrapper } from './api-data-wrapper';
import { Router } from '@angular/router';
import { AuthState } from '../models/auth';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  baseUrl:string = "http://localhost:8081/api/v1";
  private _authState = new BehaviorSubject<AuthState>(AuthState.Unknown);
  private _account = new BehaviorSubject<ApiDataWrapper<Account> | null>(null);
  public authState$ = this._authState.asObservable();
  public account$ = this._account.asObservable();

  public setAuthState(state : AuthState) {
    this._authState.next(state);
  }
  
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
    const accountSubject = new Subject<ApiDataWrapper<Account> | null>();
    this.httpClient
      .get<Account>(this.baseUrl + '/auth/account', {withCredentials: true})
      .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false })),
      )
      .subscribe((account) => {
      this._account.next(account);
      accountSubject.next(account);
    });
    return accountSubject.asObservable();
  }  
 
  public postSignIn(username:String, password:String) {
    const accountSubject = new Subject<ApiDataWrapper<Account> | null>();
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_in', {username: username, password: password}, {withCredentials: true,})
      .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false })),
        startWith({isLoading: true})
      ).subscribe((account) => {
        this._account.next(account);
        accountSubject.next(account);
      });
    return accountSubject.asObservable();
  }

  public postSignUp(username:String, password:String) : Observable<ApiDataWrapper<Account>> {
    return this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_up', {username: username, password: password}, {withCredentials: true,})
      .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false })),
        startWith({isLoading: true})
      );
  }

  public postSignOut() {
    console.log("postSignOut");
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_out', null, {withCredentials: true,})
      .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false })),
        startWith({isLoading: true})
      ).subscribe((account) => {
        this._account.next(null);
        this.router.navigate(["/"]);
      });
  }
  public postNewSession() {
    this.httpClient
    .post<Account>(this.baseUrl + '/auth/new_session', null, {withCredentials: true,})
    .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false })),
        startWith({isLoading: true})
      ).subscribe((account) => {
        this._account.next(account)
        if (this._account.value?.data?.role == AccountRole.Session)
          this.router.navigate(["/app"]);
      });
  }
}
