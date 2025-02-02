import { Injectable, numberAttribute } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, Subject} from 'rxjs';
import { ApiDataWrapper } from './api-data-wrapper';
import { Project } from '../models/project.model';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  baseUrl:string = "http://localhost:8081/api/v1";

  private _account = new BehaviorSubject<ApiDataWrapper<Account> | null>(null);
  public account$ = this._account.asObservable();
  private _project = new BehaviorSubject<Project | undefined>(undefined);
  public project$ = this._project.asObservable();
  private _projects = new BehaviorSubject<ApiDataWrapper<Project[]> | null>(null);
  public projects$ = this._projects.asObservable();

  
  constructor(private httpClient: HttpClient) {
  }
  public getAccount() : Observable<ApiDataWrapper<Account> | null> {
    this.httpClient
      .get<Account>(this.baseUrl + '/auth/account', {withCredentials: true})
      .pipe(
        map((account) => ({data: account, error: undefined})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed' })),
      )
      .subscribe((account) => {
        this._account.next(account);
      });
    return this.account$;
  }
  // --------------------------
  // Projects
  public getProjects() : Observable<ApiDataWrapper<Project[]> | null> {
    this.httpClient
      .get<Project[]>(this.baseUrl + '/projects', {withCredentials: true})
      .pipe(
        map((projects) => ({data: projects, error: undefined})),
        catchError((err) => of({data: undefined, error: err instanceof Error ? err.message : 'Data loading failed'})),
      )
      .subscribe((projects) => {
        console.log("DS getProjects: " + projects.data);
        this._projects.next(projects);
        
        if (projects.data == undefined || projects.data.length == 0)
          this._project.next(undefined);
        else {
          let projectIndex = projects.data.findIndex(e => e.id === this._project.value?.id);
          projectIndex = projectIndex > -1 ? projectIndex : 0;
          this._project.next(projects.data[projectIndex]);
        }
      });
      return this.projects$;
  }
  public postProject(project : Project) : Observable<ApiDataWrapper<Project>> {
    return this.httpClient
      .post<Project>(this.baseUrl + '/projects', project, {withCredentials: true,})
      .pipe(
        map((project) => ({data: project, error: undefined})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed' }))
      );
  }
  public putProject(project : Project) : Observable<ApiDataWrapper<Project>> {
    return this.httpClient
      .put<Project>(this.baseUrl + '/projects', project, {withCredentials: true,})
      .pipe(
        map((project) => ({data: project, error: undefined})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed' }))
      );
  }  
  public selectProject(project : Project | undefined) {
    this._project.next(project);
  }  
  // Projects
  // --------------------------
}
