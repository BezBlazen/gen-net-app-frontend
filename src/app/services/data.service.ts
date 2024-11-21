import { Injectable } from '@angular/core';
import { Account, AccountRole } from '../models/account.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, delay, map, Observable, Observer, of, ReplaySubject, startWith, Subject, tap, throwError } from 'rxjs';
import { ApiDataWrapper } from './api-data-wrapper';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  baseUrl:string = "http://localhost:8081/api/v1";
  private _account = new BehaviorSubject<ApiDataWrapper<Account> | null>(null);
  public account$ = this._account.asObservable();
  // public accountRole$ = new ReplaySubject<AccountRole | undefined>();
  // public _accountRole = new Subject<AccountRole | undefined>();
  // public accountRole$ = this._accountRole.asObservable();

  constructor(private httpClient: HttpClient, private router: Router) {
    // this.account$.subscribe(account => {if (account?.isLoading == false) {this._accountRole.next(account.data?.role); console.log('DataService role ' + account.data?.role)}})
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  public getAccount2(): Observable<Account> {
    return this.httpClient.get<Account>(this.baseUrl + '/auth/account');
    // .pipe
        // .pipe(catchError(this.handleError));
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
  public getAuth(): void {
    console.log("getAuth");
    // this.sharedService.updateAuthState({state:AuthState.LoginInProgress, username:''})
    // this.httpClient
    //     .get<Account>(this.baseUrl + '/auth/account')
    //     .pipe(
    //       // tap(data => console.log("Anlagenstatus Daten:", data)),
    //       // catchError(err => this.handleError(err))
    //       delay(3000),
    //       map((account) => ({state:AuthState.LoggedIn, username:account.username, isSession:account.isSession})),
    //       catchError((err) => of({state:AuthState.Unknown, username:'', isSession:undefined})),
    //       startWith({state:AuthState.LoginInProgress, username:'', isSession:undefined})
    //     ).subscribe(auth => {
    //       console.log('auth: ', auth);
    //       this.sharedService.updateAuthState({state:auth.state, username:(auth.isSession == false ? auth.username : '')})
    //       // if (auth === undefined)
    //       //   this.sharedService.updateAuthState({state:AuthState.Unknown, username:''})
    //       // else if (account.isSession)
    //       //   this.sharedService.updateAuthState({state:AuthState.NotLoggenIn, username:''})
    //       // else
    //       //   this.sharedService.updateAuthState({state:AuthState.LoggedIn, username:account.username})
    //     });
    // .pipe
        // .pipe(catchError(this.handleError));
  }
  
  public postSignIn2(account:Account): Observable<Account> {
    console.log('postSignIn account: ' + account.username);
    return this.httpClient.post<Account>(this.baseUrl + '/auth/signin', account)
        .pipe(catchError(this.handleError));
  }

  public postSignIn(username:String, password:String) {
    console.log("postSignIn");
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_in', {username: username, password: password}, {withCredentials: true,})
      .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false })),
        startWith({isLoading: true})
      ).subscribe((account) => {
        console.log('postSignIn: account: ', account);
        this._account.next(account);
        if (this._account.value?.data?.role == AccountRole.User)
          this.router.navigate(["/app"]);

      });
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
        console.log('postSignOut: account: ', account);
        this._account.next(null);
        this.router.navigate(["/"]);
      });
  }
  public postNewSession() {
    console.log("postNewSession");
    this.httpClient
    // .post<Account>(this.baseUrl + '/auth/new_session',{})
    .post<Account>(this.baseUrl + '/auth/new_session', null, {withCredentials: true,})
    .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false })),
        startWith({isLoading: true})
      ).subscribe((account) => {
        console.log('postNewSession: account: ', account);
        this._account.next(account)
        if (this._account.value?.data?.role == AccountRole.Session)
          this.router.navigate(["/app"]);
      });
  }
}
