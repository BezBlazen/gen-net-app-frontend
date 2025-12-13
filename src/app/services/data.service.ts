import { Injectable, numberAttribute } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, startWith, delay, Subject, skip, tap } from 'rxjs';
import { ApiDataWrapper } from './api-data-wrapper';
import { Account, AccountRole } from '../models/account.model';
import { Project } from '../models/project.model';
import { Person } from '../models/person.model';
import { I } from '@angular/cdk/keycodes';

export class DataServiceState {
  errorMessage?: string;
  isLoading: boolean = false;
}

@Injectable({
  providedIn: 'root'
})


export class DataService {
  baseUrl: string = "http://localhost:8081/api/v1";

  private loadingTimer: any;
  private _rqActiveIds = new BehaviorSubject<string[]>([]);
  private _isLoading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this._isLoading.asObservable();
  private _errorMessage = new BehaviorSubject<string | null>(null);
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
  public persons$ = this._persons.asObservable();

  errorMessageUnexpected: string = "Unexpected server error";

  constructor(private httpClient: HttpClient) {
    this._rqActiveIds.subscribe(ids => {
      if (ids.length > 0) {
        if (!this.loadingTimer) {
          this.loadingTimer = setTimeout(() => {
            if (this._rqActiveIds.value.length > 0) {
              this._isLoading.next(true);
            } else {
            }
          }, 500);
        }
      } else {
        this.loadingTimer = null;
        this._isLoading.next(false);
      }
    });
  }

  static readonly stateErrorNoIsLoadingFalse = { errorMessage: undefined, isLoading: false };
  static readonly stateErrorNoIsLoadingTrue = { errorMessage: undefined, isLoading: true };

  // Constructor
  // --------------------------
  // Errors
  public getErrorMessage(error: any): string | null {
    return error.error?.message != undefined ? error.error.message : this.errorMessageUnexpected;
  }
  // Errors
  // --------------------------
  // IsLoading
  private setIsLoading(isLoading: boolean): void {
    if (isLoading) {
      if (!this.loadingTimer) {
        this.loadingTimer = setTimeout(() => {
          this._isLoading.next(isLoading);
        }, 1000);
      }
    } else {
      this.loadingTimer = null;
      this._isLoading.next(isLoading);
    }
  }
  private guid(): string {
    return "rq-" + Math.random().toString(16).slice(2)
  }
  private updateRqIds(id: string, isLoading: boolean) {
    if (isLoading) {
      this._rqActiveIds.next(this._rqActiveIds.value.concat(id));
    } else {
      this._rqActiveIds.next(this._rqActiveIds.value.filter((rqId) => { rqId != id }));
    }
  }
  // IsLoading
  // --------------------------
  // Account
  public getAccountLastUserName(): string | null {
    return this._accountLastUserName;
  }
  public doPostSignIn(account: Account) {
    const rqId = this.guid();
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_in', account, { withCredentials: true, })
      .pipe(
        map((account) => (new ApiDataWrapper(account, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))
      ).subscribe((pipeData) => {
        this.updateRqIds(rqId, pipeData.isLoading);
        // this.updateRqIds(rqId, pipeData.isLoading);
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
    const rqId = this.guid();
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_up', account, { withCredentials: true, })
      .pipe(
        map((account) => (new ApiDataWrapper(account, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))
      ).subscribe((pipeData) => {
        this.updateRqIds(rqId, pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (pipeData?.data?.username) {
          this._isSignUpSuccess.next(true);
          this._accountLastUserName = pipeData.data.username;
        }
      });
  }
  public doPostSignOut() {
    const rqId = this.guid();
    this.httpClient
      .post<Account>(this.baseUrl + '/auth/sign_out', null, { withCredentials: true, })
      .pipe(
        map((account) => (new ApiDataWrapper(account, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))
      ).subscribe((pipeData) => {
        this.updateRqIds(rqId, pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        this._account.next(null);
      });
  }
  public rereadAccount() {
    const rqId = this.guid();
    this.httpClient
      .get<Account>(this.baseUrl + '/auth/account', { withCredentials: true })
      .pipe(
        map((account) => (new ApiDataWrapper(account, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))
      ).subscribe((pipeData) => {
        this.updateRqIds(rqId, pipeData.isLoading);
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
  getProjects(): Project[] {
    return this._projects.value;
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
    const rqId = this.guid();
    this.httpClient
      .get<Project[]>(this.baseUrl + '/projects', { withCredentials: true })
      .pipe(
        map((projects) => (new ApiDataWrapper(projects, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))
      )
      .subscribe((pipeData) => {
        this.updateRqIds(rqId, pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (!pipeData.isLoading) {
          this._projects.next(pipeData.data ? pipeData.data : <Project[]>[]);
        }
      });
  }
  public doPostProject(project: Project): Observable<boolean> {
    const rqId = this.guid();
    const _success = new BehaviorSubject<boolean>(false);
    this.httpClient
      .post<Project>(this.baseUrl + '/projects', project, { withCredentials: true, })
      .pipe(
        // delay(3000),
        map((project) => (new ApiDataWrapper(project, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))
      )
      .subscribe((pipeData) => {
        this.updateRqIds(rqId, pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (pipeData?.data) {
          this.addProject(pipeData?.data);
          _success.next(true);
        }
      });
    return _success.asObservable();
  }
  public doPutProject(project: Project): Observable<boolean> {
    const rqId = this.guid();
    const _success = new BehaviorSubject<boolean>(false);
    this.httpClient
      .put<Project>(this.baseUrl + '/projects', project, { withCredentials: true, })
      .pipe(
        // delay(3000),
        map((project) => (new ApiDataWrapper(project, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))
      )
      .subscribe((pipeData) => {
        this.updateRqIds(rqId, pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (pipeData?.data) {
          this.updateProject(pipeData?.data);
          _success.next(true);
        }
      });
    return _success.asObservable();
  }
  public doDeleteProject(project: Project): Observable<boolean> {
    const rqId = this.guid();
    const _success = new BehaviorSubject<boolean>(false);
    this.httpClient
      .delete<Project>(this.baseUrl + '/projects/' + project.id, { withCredentials: true, })
      .pipe(
        map((project) => (new ApiDataWrapper(project, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))
      )
      .subscribe((pipeData) => {
        this.updateRqIds(rqId, pipeData.isLoading);
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
  getPersonLocal(personId: string): Person | undefined {
    return this._persons.value.find((person) => person.id === personId);
  }
  getPerson(personId: string): Observable<boolean> {
    const rqId = this.guid();
    this.updateRqIds(rqId, true);
    return this.httpClient
      .get<Person>(this.baseUrl + '/persons/' + personId, { withCredentials: true})
      .pipe(
        tap(() => this.updateRqIds(rqId, false)),
        map((person) => {
          this._persons.next(this._persons.value.map(item => item.id === person.id ? person : item));
          return true;
        }),
        catchError((err) => {
          this._errorMessage.next(this.getErrorMessage(err));
          return of(false);
        }),
      );
  }
  getPersonsLocal(projectId: string | undefined): Person[] {
    if (projectId) {
      return this._persons.value.filter((person) => person.projectId === projectId);
    }
    return this._persons.value;
  }
  addPerson(person: Person): Observable<boolean> {
    const rqId = this.guid();
    this.updateRqIds(rqId, true);
    return this.httpClient
      .post<Person>(this.baseUrl + '/persons', person, { withCredentials: true})
      .pipe(
        tap(() => this.updateRqIds(rqId, false)),
        map((person) => {
          this._persons.next([...this._persons.value, person]);
          return true;
        }),
        catchError((err) => {
          this._errorMessage.next(this.getErrorMessage(err));
          return of(false);
        }),
      );
  }
  deletePerson(person: Person): Observable<boolean> {
    const rqId = this.guid();
    this.updateRqIds(rqId, true);
    return this.httpClient
      .delete<Person>(this.baseUrl + '/persons/' + person.projectId, { withCredentials: true})
      .pipe(
        tap(() => this.updateRqIds(rqId, false)),
        map(() => {
          this._persons.next(this._persons.value.filter(item => item.id !== person.id));
          return true;
        }),
        catchError((err) => {
          this._errorMessage.next(this.getErrorMessage(err));
          return of(false);
        }),
      );
  }
  updatePerson(person: Person): Observable<boolean> {
    const rqId = this.guid();
    this.updateRqIds(rqId, true);
    return this.httpClient
      .post<Person>(this.baseUrl + '/persons', person, { withCredentials: true})
      .pipe(
        tap(() => this.updateRqIds(rqId, false)),
        map((person) => {
          this._persons.next(this._persons.value.map(item => item.id === person.id ? person : item));
          return true;
        }),
        catchError((err) => {
          this._errorMessage.next(this.getErrorMessage(err));
          return of(false);
        }),
      );
  }
  // updatePerson(person: Person): void {
  //   const persons = this._persons.value;
  //   const newPersons = persons.map(item => item.id === person.id ? { ...item, ...person } : item);
  //   this._persons.next(newPersons);
  // }
  // deletePerson(person: Person): void {
  //   const persons = this._persons.value;
  //   const newPersons = persons.filter(item => item.id !== person.id);
  //   this._persons.next(newPersons);
  // }
  public getPersons(projectId: string | undefined) : Observable<boolean> {
    const rqId = this.guid();
    this.updateRqIds(rqId, true);
    let params = new HttpParams();
    if (projectId) {
      params = params.append('project_id', projectId);
    }
    return this.httpClient
      .get<Person[]>(this.baseUrl + '/persons', { withCredentials: true, params: params })
      .pipe(
        tap(() => this.updateRqIds(rqId, false)),
        map((persons) => {
          if (projectId) {
            this._persons.next(this._persons.value.filter((person) => person.projectId !== projectId).concat(persons));
          } else {
            this._persons.next(persons);
          }          
          return true;
        }),
        catchError((err) => {
          this._errorMessage.next(this.getErrorMessage(err));
          return of(false);
        }),
      )
  }
  private doPostPerson(person: Person): Observable<boolean> {
    const rqId = this.guid();
    const _success = new BehaviorSubject<boolean>(false);
    this.httpClient
      .post<Person>(this.baseUrl + '/persons', person, { withCredentials: true})
      .pipe(
        // delay(3000),
        map((person) => (new ApiDataWrapper(person, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))
      )
      .subscribe((pipeData) => {
        this.updateRqIds(rqId, pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (pipeData?.data) {
          this.addPerson(pipeData?.data);
          _success.next(true);
        }
      });
    return _success.asObservable();
  }
  public doPutPerson(person: Person): Observable<boolean> {
    const rqId = this.guid();
    const _success = new BehaviorSubject<boolean>(false);
    this.httpClient
      .put<Person>(this.baseUrl + '/persons', person, { withCredentials: true, })
      .pipe(
        // delay(3000),
        map((person) => (new ApiDataWrapper(person, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))
      )
      .subscribe((pipeData) => {
        this.updateRqIds(rqId, pipeData.isLoading);
        this._errorMessage.next(pipeData.errorMessage);
        if (pipeData?.data) {
          this.updatePerson(pipeData?.data);
          _success.next(true);
        }
      });
    return _success.asObservable();
  }
  public doDeletePerson(person: Person): Observable<boolean> {
    const rqId = this.guid();
    const _success = new BehaviorSubject<boolean>(false);
    this.httpClient
      .delete<Person>(this.baseUrl + '/persons/' + person.id, { withCredentials: true, })
      .pipe(
        map((person) => (new ApiDataWrapper(person, false, null))),
        catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
        startWith(new ApiDataWrapper(undefined, true, null))
      )
      .subscribe((pipeData) => {
        this.updateRqIds(rqId, pipeData.isLoading);
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
