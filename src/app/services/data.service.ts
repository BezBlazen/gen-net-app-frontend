import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { catchError, map, Observable, of} from 'rxjs';
import { ApiDataWrapper } from './api-data-wrapper';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  baseUrl:string = "http://localhost:8081/api/v1";
  
  constructor(private httpClient: HttpClient) {
  }
  public getProjects() : Observable<ApiDataWrapper<Project[]> | null> {
    return this.httpClient
      .get<Project[]>(this.baseUrl + '/projects', {withCredentials: true})
      .pipe(
        map((account) => ({data: account, error: undefined})),
        catchError((err) => of({error: err instanceof Error ? err.message : 'Data loading failed'})),
      );
  }    
}
