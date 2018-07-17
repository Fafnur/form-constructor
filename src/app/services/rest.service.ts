import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/internal/operators';

import { RestEntity } from '../models/rest-entity';

/**
 * RestService
 */
export abstract class RestService<T extends RestEntity> {
  /**
   * Api path
   */
  protected url: string;

  /**
   * Headers
   */
  protected headers: HttpHeaders;

  /**
   * HttpClient
   */
  protected httpClient: HttpClient;

  /**
   * @param {string} url
   */
  protected constructor(url ?: string) {
    this.url = url;
    this.headers = new HttpHeaders();
  }

  /**
   * @template T
   * @param entity
   * @returns {T}
   */
  public transform(entity: any): T {
    return entity;
  }

  /**
   * @template T
   * @param {T} entity
   * @returns {any}
   */
  public reverseTransform(entity: T): any {
    return entity;
  }

  /**
   * @param search
   * @returns {HttpParams}
   */
  public getParams(search: any = {}): HttpParams {
    let params = new HttpParams();
    for (const propKey in search) {
      if (propKey !== 'sort') {
        if (search.hasOwnProperty(propKey) && search[propKey]) {
          params = params.append(propKey, search[propKey].toString());
        }
      }
    }
    if (search['sort']) {
      search['sort'].forEach(sort => {
        params = params.append(`_sort[${sort.name}]`, sort.value);
      });
    }

    return params;
  }

  /**
   * @template T
   * @param {any} search
   * @returns {Observable<T[]>}
   */
  public get(search: any = {}): Observable<T[]> {
    const url = this.url;
    const options = {headers: this.headers, params: this.getParams(search)};

    return this.httpClient.get<HttpResponse<T[]>>(url, options)
      .pipe(
        map((data: HttpResponse<T[]>) => this.extractData(data)),
        catchError(this.handleError<T>())
      );
  }

  /**
   * @template T
   * @param {string} id
   * @param search
   * @returns {Observable<T>}
   */
  public getOne(id: string, search: any = {}): Observable<T> {
    const url = `${this.url}/${id}`;
    const options = {headers: this.headers, params: this.getParams(search)};

    return this.httpClient.get<HttpResponse<T>>(url, options)
      .pipe(
        map((data: HttpResponse<T>) => this.extractData(data)),
        catchError(this.handleError<T>())
      );
  }

  /**
   * Return entity by field
   *
   * @param field
   * @param search
   * @returns {Observable<T extends RestEntity>}
   */
  public getOneByField(field: any, search: any = {}): Observable<T> {
    const url = `${this.url}/${field.name}/${field.value}`;
    const options = {headers: this.headers, params: this.getParams(search)};

    return this.httpClient.get<T>(url, options)
      .pipe(
        catchError(this.handleError<T>())
      );
  }

  /**
   * @param {T} entity
   * @param search
   * @returns {Observable<T extends RestEntity>}
   */
  public post(entity: T, search: any = {}): Observable<T> {
    const transformedEntity: any = this.reverseTransform(entity);
    const options = {headers: this.headers, params: this.getParams(search)};

    return this.httpClient.post<HttpResponse<T>>(this.url, JSON.stringify(transformedEntity), options)
      .pipe(
        map(data => this.extractData(data)),
        catchError(this.handleError<T>())
      );
  }

  /**
   * @param {FormData} formData
   * @param search
   * @returns {Observable<T extends RestEntity>}
   */
  public postData(formData: FormData, search: any = {}): Observable<T> {
    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data'
    });
    const options = {headers: this.headers, params: this.getParams(search)};

    return this.httpClient.post<T>(this.url, formData, options)
      .pipe(
        catchError(this.handleError<T>())
      );
  }

  /**
   * @param {T} entity
   * @param search
   * @returns {Observable<any>}
   */
  public patch(entity: T, search: any = {}): Observable<any> {
    const url = `${this.url}/${entity.id}`;
    const transformedEntity: any = this.reverseTransform(entity);
    const options = {headers: this.headers, params: this.getParams(search)};

    return this.httpClient.patch<T>(url, JSON.stringify(transformedEntity), options)
      .pipe(
        catchError(this.handleError<T>())
      );
  }

  /**
   * @param {T} entity
   * @param search
   * @returns {Observable<any>}
   */
  public put(entity: T, search: any = {}): Observable<any> {
    const url = `${this.url}/${entity.id}`;
    const transformedEntity: any = this.reverseTransform(entity);
    const options = {headers: this.headers, params: this.getParams(search)};

    return this.httpClient.put<T>(url, JSON.stringify(transformedEntity), options).pipe(
      catchError(this.handleError<T>())
    );
  }

  /**
   * @param {string} id
   * @param search
   * @returns {Observable<any>}
   */
  public delete(id: string, search: any = {}): Observable<any> {
    const url = `${this.url}/${id}`;
    const options = {headers: this.headers, params: this.getParams(search)};

    return this.httpClient.delete<T>(url, options).pipe(
      catchError(this.handleError<T>())
    );
  }

  /**
   * @param responseData
   * @returns {any}
   */
  protected extractData(responseData: any): any {
    let data: any = responseData['data'];

    if (Array.isArray(data)) {
      data = data.map(entity => this.transform(entity));
    } else {
      data = this.transform(data);
    }

    return data;
  }

  /**
   * Handle Http operation that failed.
   *
   * @param {string} operation
   * @param {T} result
   * @returns {(error: any) => Observable<T extends RestEntity>}
   */
  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(error);
    };
  }
}
