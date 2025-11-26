import { Injectable, numberAttribute } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, startWith, delay, Subject } from 'rxjs';
import { ApiDataWrapper } from './api-data-wrapper';
import { Account, AccountRole } from '../models/account.model';
import { Project } from '../models/project.model';
import { Person } from '../models/person.model';

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

  private _persons = new BehaviorSubject<Person[]>([]);
  public persons$ = this._projects.asObservable();

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
  getProject(projectId: string): Project | undefined {
    return this._projects.value.find((project) => project.id === projectId);
  }
  addProject(project: Project): void {
    const projects = this._projects.value;
    this._projects.next([...projects, project]);
  }
  updateProject(project: Project): void {
    const projects = this._projects.value;
    const newProjects = projects.map(item => item.id === project.id ? { ...item, ...project } : item);
    this._projects.next(newProjects);
  }
  deleteProject(project: Project): void {
    const projects = this._projects.value;
    const newProjects = projects.filter(item => item.id !== project.id);
    this._projects.next(newProjects);
  }
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
  public doPostProject(project : Project) : Observable<boolean> {
    const _success = new BehaviorSubject<boolean>(false);
    this.httpClient
      .post<Project>(this.baseUrl + '/projects', project, {withCredentials: true,})
      .pipe(
        // delay(3000),
        map((project) => (new ApiDataWrapper(project, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))  
      )
      .subscribe((pipeData) => {
        this._isLoading.next(pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (pipeData?.data) {
          this.addProject(pipeData?.data);
          _success.next(true);
        }
      });
    return _success.asObservable(); 
  }
  public doPutProject(project : Project) : Observable<boolean> {
    const _success = new BehaviorSubject<boolean>(false);
    this.httpClient
      .put<Project>(this.baseUrl + '/projects', project, {withCredentials: true,})
      .pipe(
        // delay(3000),
        map((project) => (new ApiDataWrapper(project, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))  
      )
      .subscribe((pipeData) => {
        this._isLoading.next(pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (pipeData?.data) {
          this.updateProject(pipeData?.data);
          _success.next(true);
        }
      });
    return _success.asObservable(); 
  }
  public doDeleteProject(project : Project) : Observable<boolean> {
    const _success = new BehaviorSubject<boolean>(false);
    this.httpClient
      .delete<Project>(this.baseUrl + '/projects/' + project.id, {withCredentials: true,})
      .pipe(
        map((project) => (new ApiDataWrapper(project, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))  
      )
      .subscribe((pipeData) => {
        this._isLoading.next(pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (!pipeData.isLoading && !pipeData.errorMessage) {
          this.deleteProject(project);
          _success.next(true);
        }
      });
    return _success.asObservable(); 
  }
  // Projects
  // --------------------------
  // Persons
  getPerson(personId: string): Person | undefined {
    return this._persons.value.find((person) => person.id === personId);
  }
  addPerson(person: Person): void {
    const persons = this._persons.value;
    this._persons.next([...persons, person]);
  }
  updatePerson(person: Person): void {
    const persons = this._persons.value;
    const newPersons = persons.map(item => item.id === person.id ? { ...item, ...person } : item);
    this._persons.next(newPersons);
  }
  deletePerson(person: Person): void {
    const persons = this._persons.value;
    const newPersons = persons.filter(item => item.id !== person.id);
    this._persons.next(newPersons);
  }
  public doGetPersons() {
    this.httpClient
      .get<Person[]>(this.baseUrl + '/persons', {withCredentials: true})
      .pipe(
        map((persons) => (new ApiDataWrapper(persons, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))  
      )
      .subscribe((pipeData) => {
        this._isLoading.next(pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (!pipeData.isLoading && pipeData.data)     
          this._persons.next(pipeData.data);
      });
  }
  public doPostPerson(person : Person) : Observable<boolean> {
    const _success = new BehaviorSubject<boolean>(false);
    this.httpClient
      .post<Person>(this.baseUrl + '/persons', person, {withCredentials: true,})
      .pipe(
        // delay(3000),
        map((person) => (new ApiDataWrapper(person, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))  
      )
      .subscribe((pipeData) => {
        this._isLoading.next(pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (pipeData?.data) {
          this.addPerson(pipeData?.data);
          _success.next(true);
        }
      });
    return _success.asObservable(); 
  }
  public doPutPerson(person : Person) : Observable<boolean> {
    const _success = new BehaviorSubject<boolean>(false);
    this.httpClient
      .put<Person>(this.baseUrl + '/persons', person, {withCredentials: true,})
      .pipe(
        // delay(3000),
        map((person) => (new ApiDataWrapper(person, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))  
      )
      .subscribe((pipeData) => {
        this._isLoading.next(pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (pipeData?.data) {
          this.updatePerson(pipeData?.data);
          _success.next(true);
        }
      });
    return _success.asObservable(); 
  }
  public doDeletePerson(person : Person) : Observable<boolean> {
    const _success = new BehaviorSubject<boolean>(false);
    this.httpClient
      .delete<Person>(this.baseUrl + '/persons/' + person.id, {withCredentials: true,})
      .pipe(
        map((person) => (new ApiDataWrapper(person, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))  
      )
      .subscribe((pipeData) => {
        this._isLoading.next(pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (!pipeData.isLoading && !pipeData.errorMessage) {
          this.deletePerson(person);
          _success.next(true);
        }
      });
    return _success.asObservable(); 
  }
  // Persons
  // --------------------------

}
