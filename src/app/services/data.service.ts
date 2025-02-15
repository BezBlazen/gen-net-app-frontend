import { Injectable, numberAttribute } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, startWith, delay, Subject} from 'rxjs';
import { ApiDataWrapper } from './api-data-wrapper';
import { Project } from '../models/project.model';
import { Account, AccountRole } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  baseUrl:string = "http://localhost:8081/api/v1";

  private _account = new BehaviorSubject<ApiDataWrapper<Account> | null>(null);
  public account$ = this._account.asObservable();
  private _signInAccount = new BehaviorSubject<ApiDataWrapper<Account> | null>(null);
  public signInAccount$ = this._signInAccount.asObservable();
  private _signUpAccount = new BehaviorSubject<ApiDataWrapper<Account> | null>(null);
  public signUpAccount$ = this._signUpAccount.asObservable();
  private _project = new BehaviorSubject<Project | undefined>(undefined);
  public project$ = this._project.asObservable();
  private _projects = new BehaviorSubject<ApiDataWrapper<Project[]> | null>(null);
  public projects$ = this._projects.asObservable();
  // Default app project
  // private _appProject : Project | undefined;
  private _appProject = new BehaviorSubject<Project | undefined>(undefined);
  public appProject$ = this._appProject.asObservable();
  private _appProjectList = new BehaviorSubject<ApiDataWrapper<Project[]> | null>(null);
  public appProjectList$ = this._appProjectList.asObservable();
  private _appTmpProjectList = new BehaviorSubject<ApiDataWrapper<Project[]> | null>(null);
  public appTmpProjectList$ = this._appTmpProjectList.asObservable();
  private _projectsProjectList = new BehaviorSubject<ApiDataWrapper<Project[]> | null>(null);
  public projectsProjectList$ = this._projectsProjectList.asObservable();
  errorMessageUnexpected:string = "Unexpected message";
  
  constructor(private httpClient: HttpClient) {
  }

  // Constructor
  // --------------------------
  // Account
  public isUser() : Observable<boolean> {
    return of(this._account.value?.data?.role == AccountRole.User);
  }  
  public resetSignErrors() {
    this._signInAccount.next(null);
    this._signUpAccount.next(null);
  }
  public rereadAccount() {
    this.httpClient
      .get<Account>(this.baseUrl + '/auth/account', {withCredentials: true})
      .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err.error?.message != undefined ? err.error.message : this.errorMessageUnexpected, isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})
      )
      .subscribe((account) => {
        this._account.next(account);
      });
  }
  public postSignIn(account:Account) {
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_in', account, {withCredentials: true,})
      .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err.error?.message != undefined ? err.error.message : this.errorMessageUnexpected, isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})
      ).subscribe((account) => {
        this._signInAccount.next(account);
        if (account.isLoading != true && account.data != undefined) {
          this._account.next(account);
          this.rereadAppProjectList();
          this.rereadTmpProjectList();
        } else {
          this._account.next(null);
        }

      });
  }
  public postSignUp(account:Account) {
    console.log(account);
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_up', account, {withCredentials: true,})
      .pipe(
        map((account) => ({data: account, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err.error?.message != undefined ? err.error.message : this.errorMessageUnexpected, isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})        
      ).subscribe((account) => {
        this._signUpAccount.next(account);
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
        this._account.next(account);
        if (account.isLoading != true) {
          this.rereadAccount();
          this._appProject.next(undefined);
          this._appProjectList.next(null);
          this._projectsProjectList.next(null);
        }
      });
  }  
  // Account
  // --------------------------
  // Projects
  public rereadAppProjectList() {
    this.httpClient
      .get<Project[]>(this.baseUrl + '/projects', {withCredentials: true})
      .pipe(
        // delay(3000),
        map((projects) => ({data: projects, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err.error?.message != undefined ? err.error.message : this.errorMessageUnexpected, isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})
      )
      .subscribe((projects) => {
        this._appProjectList.next(projects);
        if (projects.isLoading != true) {
          let p = this._appProjectList.value?.data?.find(e => e.id == this._appProject.value?.id);
          if (p == undefined && projects.data != undefined && projects.data.length > 0)
            this.setAppProject(projects.data[0]);
          else
            this.setAppProject(p);
        }
      });
  }
  public rereadProjectsProjectList() {
    this.httpClient
      .get<Project[]>(this.baseUrl + '/projects', {withCredentials: true})
      .pipe(
        // delay(3000),
        map((projects) => ({data: projects, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err.error?.message != undefined ? err.error.message : this.errorMessageUnexpected, isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})
      )
      .subscribe((projects) => {
        this._projectsProjectList.next(projects);
      });
  }
  public postProject(project : Project) : Observable<ApiDataWrapper<Project> | null> {
    const _project = new BehaviorSubject<ApiDataWrapper<Project> | null>(null);
    this.httpClient
      .post<Project>(this.baseUrl + '/projects', project, {withCredentials: true,})
      .pipe(
        // delay(3000),
        map((project) => ({data: project, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err.error?.message != undefined ? err.error.message : this.errorMessageUnexpected, isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})
      )
      .subscribe((project) => {
        _project.next(project);
      });
    return _project.asObservable();      
  }
  public putProject(project : Project) : Observable<ApiDataWrapper<Project> | null> {
    const _project = new BehaviorSubject<ApiDataWrapper<Project> | null>(null);
    this.httpClient
      .put<Project>(this.baseUrl + '/projects', project, {withCredentials: true,})
      .pipe(
        map((project) => ({data: project, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err.error?.message != undefined ? err.error.message : this.errorMessageUnexpected, isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})
      )
      .subscribe((project) => {
        _project.next(project);
      });
    return _project.asObservable();      
  }
  public deleteProject(project : Project) : Observable<ApiDataWrapper<Project> | null> {
    const _project = new BehaviorSubject<ApiDataWrapper<Project> | null>(null);
    this.httpClient
      .delete<Project>(this.baseUrl + '/projects/' + project.id, {withCredentials: true,})
      .pipe(
        // delay(3000),
        map((project) => ({data: project, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err.error?.message != undefined ? err.error.message : this.errorMessageUnexpected, isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})
      )
      .subscribe((project) => {
        _project.next(project);
      });
    return _project.asObservable();      
  }
  public setAppProject(project : Project | undefined) {
    this._appProject.next(this._appProjectList.value?.data?.find(e => e.id == project?.id));
  }
  public rereadTmpProjectList() {
    this.httpClient
      .get<Project[]>(this.baseUrl + '/projects/tmp', {withCredentials: true})
      .pipe(
        // delay(3000),
        map((projects) => ({data: projects, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err.error?.message != undefined ? err.error.message : this.errorMessageUnexpected, isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})
      )
      .subscribe((projects) => {
        this._appTmpProjectList.next(projects);
      });
  }  
  public moveTmpProjectList() {
    this.httpClient
      .put<Project[]>(this.baseUrl + '/projects/tmp', {}, {withCredentials: true})
      .pipe(
        // delay(3000),
        map((projects) => ({data: projects, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err.error?.message != undefined ? err.error.message : this.errorMessageUnexpected, isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})
      )
      .subscribe((projects) => {
        this._appTmpProjectList.next(projects);
      });
  }  
  public deleteTmpProjectList() {
    this.httpClient
      .delete<Project[]>(this.baseUrl + '/projects/tmp', {withCredentials: true})
      .pipe(
        // delay(3000),
        map((projects) => ({data: projects, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err.error?.message != undefined ? err.error.message : this.errorMessageUnexpected, isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})
      )
      .subscribe((projects) => {
        this._appTmpProjectList.next(projects);
      });
  }  
  // Projects
  // --------------------------
}
