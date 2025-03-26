import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {map, catchError, mergeMap } from 'rxjs/operators';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionariosService {

  private apiPath: string = "api/funcionarios"

  constructor(private http: HttpClient) { }

  getAll(isGestor?: boolean|null):Observable<Funcionario[]>{
    const api = `${this.apiPath}${isGestor ? `?isGestor=${isGestor}` : ''}`;
    return this.http.get<Funcionario[]>(api).pipe(
      catchError(this.handleError)
      )
  }

  getById(id: string):Observable<Funcionario>{
    return this.http.get<Funcionario>(`${this.apiPath}/${id}`).pipe(
      catchError(this.handleError)
      )
  }

  post(funcionario: Funcionario): Observable<Funcionario>{
    return this.http.post<Funcionario>(this.apiPath, funcionario).pipe(
      catchError(this.handleError)
      )
  }

  put(funcionario: Funcionario): Observable<Funcionario>{
    return this.http.put<Funcionario>(`${this.apiPath}/${funcionario.id}`, funcionario).pipe(
      catchError(this.handleError)
      )
  }

  delete(id: string): Observable<any>{
    return this.http.delete<any>(`${this.apiPath}/${id}`).pipe(
      catchError(this.handleError)
      )
  }

  private handleError(error: string[]){
    return throwError(() => error);
  }
}
