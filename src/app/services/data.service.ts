import { Injectable, numberAttribute } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, startWith, delay, Subject} from 'rxjs';
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
  // Default app project
  // private _appProject : Project | undefined;
  private _appProject = new BehaviorSubject<Project | undefined>(undefined);
  public appProject$ = this._appProject.asObservable();
  private _appProjectList = new BehaviorSubject<ApiDataWrapper<Project[]> | null>(null);
  public appProjectList$ = this._appProjectList.asObservable();
  private _projectsProjectList = new BehaviorSubject<ApiDataWrapper<Project[]> | null>(null);
  public projectsProjectList$ = this._projectsProjectList.asObservable();

  
  constructor(private httpClient: HttpClient) {
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
      });
    return this.account$;
  }
  // --------------------------
  // Projects
  public rereadAppProjectList() {
    this.httpClient
      .get<Project[]>(this.baseUrl + '/projects', {withCredentials: true})
      .pipe(
        // delay(3000),
        map((projects) => ({data: projects, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false})),
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
        catchError((err) => of({data: undefined, error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})
      )
      .subscribe((projects) => {
        this._projectsProjectList.next(projects);
      });
  }  
  // public getProjects() : Observable<ApiDataWrapper<Project[]> | null> {
  //   this.httpClient
  //     .get<Project[]>(this.baseUrl + '/projects', {withCredentials: true})
  //     .pipe(
  //       map((projects) => ({data: projects, error: undefined, isLoading: false})),
  //       catchError((err) => of({data: undefined, error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false})),
  //       startWith({data: undefined, error: undefined, isLoading: true})
  //     )
  //     .subscribe((projects) => {
  //       console.log("DS getProjects: " + projects.data);
  //       this._projects.next(projects);
        
  //       if (projects.data == undefined || projects.data.length == 0)
  //         this._project.next(undefined);
  //       else {
  //         let projectIndex = projects.data.findIndex(e => e.id === this._project.value?.id);
  //         projectIndex = projectIndex > -1 ? projectIndex : 0;
  //         this._project.next(projects.data[projectIndex]);
  //       }
  //       if (projects.isLoading != true)
  //         this.setAppProject(projects?.data?.find(project => project.id == this._appProject.value?.id))
  //       // if (!(projects?.data?.find(prj => prj.id == this.projectObj?.id))) {
  //       //   this.projectObj = undefined;
  //       // }
  //     });
  //     return this.projects$;
  // }
  public postProject(project : Project) : Observable<ApiDataWrapper<Project> | null> {
    const _project = new BehaviorSubject<ApiDataWrapper<Project> | null>(null);
    this.httpClient
      .post<Project>(this.baseUrl + '/projects', project, {withCredentials: true,})
      .pipe(
        // delay(3000),
        map((project) => ({data: project, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false})),
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
        catchError((err) => of({data: undefined, error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})
      )
      .subscribe((project) => {
        _project.next(project);
      });
    return _project.asObservable();      
    // return this.httpClient
    //   .put<Project>(this.baseUrl + '/projects', project, {withCredentials: true,})
    //   .pipe(
    //     map((project) => ({data: project, error: undefined, isLoading: false})),
    //     catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false}))
    //   );
  }
  public deleteProject(project : Project) : Observable<ApiDataWrapper<Project> | null> {
    const _project = new BehaviorSubject<ApiDataWrapper<Project> | null>(null);
    this.httpClient
      .delete<Project>(this.baseUrl + '/projects/' + project.id, {withCredentials: true,})
      .pipe(
        // delay(3000),
        map((project) => ({data: project, error: undefined, isLoading: false})),
        catchError((err) => of({data: undefined, error: err instanceof Error ? err.message : 'Data loading failed', isLoading: false})),
        startWith({data: undefined, error: undefined, isLoading: true})
      )
      .subscribe((project) => {
        _project.next(project);
      });
    return _project.asObservable();      
  }
  // public selectProject(project : Project | undefined) {
  //   this._project.next(project);
  // }  
  public setAppProject(project : Project | undefined) {
    this._appProject.next(this._appProjectList.value?.data?.find(e => e.id == project?.id));
  }  
  // Projects
  // --------------------------
}
