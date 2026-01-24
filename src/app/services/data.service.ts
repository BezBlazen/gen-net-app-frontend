import { Injectable, numberAttribute } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, startWith, delay, Subject, skip, tap, Subscription } from 'rxjs';
import { ApiDataWrapper } from './api-data-wrapper';
// import { Account, AccountRole } from '../models/account.model';
// import { Project } from '../models/project.model';
// import { Person } from '../models/person.model';
import { I } from '@angular/cdk/keycodes';
import { AccountDtoApi } from '../../api/model/accountDto';
import { AccountSignInDtoApi } from '../../api/model/accountSignInDto';
import { AccountSignUpDtoApi } from '../../api/model/accountSignUpDto';
import { FieldOptions, Person, Project } from '../models/api.model';
// import { SchemasApi } from '../../api/model/dictUri';
import { UriDtoApi } from '../../api/model/uriDto';
import { CommonApiUri } from '../models/common.model';
// import { AccountDto, AccountSignInDto, AccountSignUpDto, Project } from '../../api';

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

  private _account = new BehaviorSubject<AccountDtoApi | undefined>(undefined);
  public account$ = this._account.asObservable();
  private _accountLastUserName?: string;

  public dictUri?: UriDtoApi[];
  private _dictUri = new BehaviorSubject<UriDtoApi[]>([]);
  private _uriSubscription?: Subscription;
  public dictUri$ = this._dictUri.asObservable();

  private _activeProjectId = new BehaviorSubject<string | undefined>(undefined);
  public activeProjectId$ = this._activeProjectId.asObservable();

  private _projects = new BehaviorSubject<Project[]>([]);
  private _projectsSubscription?: Subscription;
  public projects$ = this._projects.asObservable();

  private _persons = new BehaviorSubject<Person[]>([]);
  private _accountSubscription?: Subscription;
  private _personsSubscription?: Subscription;
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
  public getAccountLastUserName(): string | undefined {
    return this._accountLastUserName;
  }
  public doSignIn(account: AccountSignInDtoApi): Observable<boolean> {
    const rqId = this.guid();
    this.updateRqIds(rqId, true);
    return this.httpClient
      .post<AccountDtoApi>(this.baseUrl + '/auth/sign_in', account, { withCredentials: true, })
      .pipe(
        tap(() => this.updateRqIds(rqId, false)),
        map((account) => {
          this._account.next(account);
          return true;
        }),
        catchError((err) => {
          this._errorMessage.next(this.getErrorMessage(err));
          return of(false);
        }),
      );

  }
  public doSignUp(account: AccountSignUpDtoApi): Observable<boolean> {
    const rqId = this.guid();
    this.updateRqIds(rqId, true);
    return this.httpClient
      .post<AccountDtoApi>(this.baseUrl + '/auth/sign_up', account, { withCredentials: true, })
      .pipe(
        tap(() => this.updateRqIds(rqId, false)),
        map((account) => {
          this._accountLastUserName = account.username;
          return true;
        }),
        catchError((err) => {
          this._errorMessage.next(this.getErrorMessage(err));
          return of(false);
        }),
      );
  }
  public doSignOut(): Observable<boolean> {
    const rqId = this.guid();
    this.updateRqIds(rqId, true);
    return this.httpClient
      .post<AccountDtoApi>(this.baseUrl + '/auth/sign_out', null, { withCredentials: true, })
      .pipe(
        tap(() => this.updateRqIds(rqId, false)),
        map(() => {
          this._account.next(undefined);
          return true;
        }),
        catchError((err) => {
          this._errorMessage.next(this.getErrorMessage(err));
          return of(false);
        }),
      );
  }
  private isAccountValid(): boolean {
    return this._account.value != null && this._account.value.username != null && this._account.value.roleType != null;
  }
  // public reloadAccount() {
  //   const rqId = this.guid();
  //   this.httpClient
  //     .get<Account>(this.baseUrl + '/auth/account', { withCredentials: true })
  //     .pipe(
  //       map((account) => (new ApiDataWrapper(account, false, null))),
  //       catchError((err) => of(new ApiDataWrapper(undefined, false, this.getErrorMessage(err)))),
  //       startWith(new ApiDataWrapper(undefined, true, null))
  //     ).subscribe((pipeData) => {
  //       this.updateRqIds(rqId, pipeData.isLoading);
  //       // Hide reread errors
  //       // this._errorMessage.next(pipeData.errorMessage);
  //       if (pipeData.data != undefined) {
  //         this._account.next(pipeData.data);
  //       } else {
  //         this._account.next(null);
  //       }
  //     });
  // }
  public getAccount(): Observable<boolean> {
    const _success = new Subject<boolean>();
    if (this._accountSubscription) {
      this._accountSubscription.unsubscribe();
    }
    const rqId = this.guid();
    this._accountSubscription = this.httpClient
      .get<AccountDtoApi>(this.baseUrl + '/auth/account', { withCredentials: true })
      .subscribe({
        next: (account) => {
          this._account.next(account.username ? account : undefined);
          _success.next(true);
        },
        error: (err) => {
          this._errorMessage.next(this.getErrorMessage(err));
          this._account.next(undefined);
          _success.next(false);
        },
        complete: () => {
          this.updateRqIds(rqId, false);
          this._accountSubscription = undefined;
        }
      });
    return _success.asObservable();
  }
  // Account
  // --------------------------
  // Uri
  public getDictUri(): Observable<boolean> {
    const _success = new Subject<boolean>();
    if (this.isAccountValid()) {
      const rqId = this.guid();
      this._uriSubscription = this.httpClient
        .get<UriDtoApi[]>(this.baseUrl + '/dict_uri', { withCredentials: true })
        .subscribe({
          next: (dictUri) => {
            this._dictUri.next(dictUri);
            this.dictUri = dictUri;
            _success.next(true);
          },
          error: (err) => {
            this._errorMessage.next(this.getErrorMessage(err));
            this._dictUri.next([]);
            this.dictUri = undefined;
            _success.next(false);
          },
          complete: () => {
            this.updateRqIds(rqId, false);
            this._uriSubscription = undefined;
          }
        });
    } else {
      this._dictUri.next([]);
      this.dictUri = undefined;
      _success.next(false);
    }
    return _success.asObservable();
  }
  getDictUriLocal(): UriDtoApi[] {
    return JSON.parse(JSON.stringify(this._dictUri.value));
  }
  getDictUriGenderTypesOption(): FieldOptions[] | undefined {
    return this.dictUri?.filter(dictUri => dictUri.uri?.startsWith(CommonApiUri.PrefixGenderType)).map(type => ({
      label: type.title,
      value: type.uri,
      description: type.description
    }));
  }
  getDictUriNameTypesOption(): FieldOptions[] | undefined {
    return this.dictUri?.filter(dictUri => dictUri.uri?.startsWith(CommonApiUri.PrefixNameType)).map(type => ({
      label: type.title,
      value: type.uri,
      description: type.description
    }));
  }
  // Schemas
  // --------------------------
  // Cache
  resetCache() {
    this._projects.next([]);
    this._persons.next([]);
    this._activeProjectId.next(undefined);
  }
  // Cache
  // --------------------------
  // Projects
  setActiveProjectId(projectId: string) {
    this._activeProjectId.next(this.getProjectLocal(projectId)?.id);
  }
  actualizeActiveProjectId() {
    this._activeProjectId.next(this.getProjectLocal(this._activeProjectId.value)?.id);
  }
  getProjectLocal(projectId: string | undefined): Project | undefined {
    return projectId ? this._projects.value.find((project) => project.id === projectId) ?? this._projects.value[0] : this._projects.value[0];
  }
  getProjectsLocal(): Project[] {
    return JSON.parse(JSON.stringify(this._projects.value));
  }
  getProjects(): Observable<boolean> {
    const _result = new Subject<boolean>();
    if (this._projectsSubscription) {
      this._projectsSubscription.unsubscribe();
    }
    const rqId = this.guid();
    this.updateRqIds(rqId, true);
    this._projectsSubscription = this.httpClient
      .get<Project[]>(this.baseUrl + '/projects', { withCredentials: true })
      .subscribe({
        next: (projects) => {
          this._projects.next(projects);
          _result.next(true);
        },
        error: (err) => {
          this._errorMessage.next(this.getErrorMessage(err));
          this._projects.next([]);
          _result.next(false);
        },
        complete: () => {
          this.updateRqIds(rqId, false);
          this._projectsSubscription = undefined;
        }
      });
    return _result.asObservable();
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
    this.actualizeActiveProjectId();
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
    const person = personId ? this._persons.value.find((person) => person.id === personId) : undefined;
    return person ? JSON.parse(JSON.stringify(person)) : undefined;
  }
  getPerson(personId: string): Observable<boolean> {
    const rqId = this.guid();
    this.updateRqIds(rqId, true);
    return this.httpClient
      .get<Person>(this.baseUrl + '/persons/' + personId, { withCredentials: true })
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
    if (!projectId) {
      return [];
    }
    return JSON.parse(JSON.stringify(this._persons.value.filter((person) => person.projectId === projectId)));
  }
  addPerson(person: Person): Observable<boolean> {
    const rqId = this.guid();
    this.updateRqIds(rqId, true);
    return this.httpClient
      .post<Person>(this.baseUrl + '/persons', person, { withCredentials: true })
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
      .delete<Person>(this.baseUrl + '/persons/' + person.id, { withCredentials: true })
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
      .post<Person>(this.baseUrl + '/persons', person, { withCredentials: true })
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
  /*
  public getPersons(projectId: string | undefined): Observable<boolean> {
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
  }*/
  getActiveProjectPersons(): Observable<boolean> {
    return this._activeProjectId.value ? this.getPersons(this._activeProjectId.value) : of(false);
  }
  getPersons(projectId: string): Observable<boolean> {
    const _result = new Subject<boolean>();
    if (this._personsSubscription) {
      this._personsSubscription.unsubscribe();
    }
    const rqId = this.guid();
    this.updateRqIds(rqId, true);
    let params = new HttpParams();
    if (projectId) {
      params = params.append('project_id', projectId);
    }
    this._projectsSubscription = this.httpClient
      .get<Person[]>(this.baseUrl + '/persons', { withCredentials: true, params: params })
      .subscribe({
        next: (persons) => {
          if (projectId) {
            this._persons.next(this._persons.value.filter((person) => person.projectId !== projectId).concat(persons));
          } else {
            this._persons.next(persons);
          }
          _result.next(true);
        },
        error: (err) => {
          this._errorMessage.next(this.getErrorMessage(err));
          this._persons.next([]);
          _result.next(false);
        },
        complete: () => {
          this.updateRqIds(rqId, false);
          this._personsSubscription = undefined;
        }
      });
    return _result.asObservable();
  }
  private doPostPerson(person: Person): Observable<boolean> {
    const rqId = this.guid();
    const _success = new BehaviorSubject<boolean>(false);
    this.httpClient
      .post<Person>(this.baseUrl + '/persons', person, { withCredentials: true })
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
