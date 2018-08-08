import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/internal/operators';

import { RestCollection, RestEntity } from '../models/rest';
import { RestCollectionResponse } from '../models/rest';
import { RestErrorResponse } from '../models/rest';

/**
 * RestService
 */
export abstract class RestService<T extends RestEntity> {
  public static reservedParams: string[] = ['sort', 'order', 'groups'];

  /**
   * Api path
   */
  protected url: string;

  /**
   * Headers
   */
  protected headers: HttpHeaders = new HttpHeaders();

  /**
   * HttpClient
   */
  protected httpClient: HttpClient;

  public constructor(url: string) {
    this.url = url;
  }

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
   * @param {Object} search
   * @returns {HttpParams}
   */
  public getParams(search: Object = {}): HttpParams {
    let params = new HttpParams();
    for (const propKey of Object.keys(search).sort()) {
      if (RestService.reservedParams.indexOf(propKey) < 0) {
        if (search.hasOwnProperty(propKey) && search[propKey] !== undefined) {
          if (propKey === 'map') {
            console.log(search);
          }
          params = params.append(propKey, search[propKey].toString());
        }
      }
    }
    if (search['order']) {
      params = params.append(`order[${search['order'].name}]`, search['order'].direction);
    }
    if (search['sort']) {
      search['sort'].forEach(sort => {
        params = params.append(`order[${sort.name}]`, sort.direction);
      });
    }
    if (search['groups']) {
      if (Array.isArray(search['groups'])) {
        search['groups'].sort().forEach(group => {
          params = params.append('groups[]', group);
        });
      } else {
        params = params.append('groups[]', search['groups']);
      }
    }

    return params;
  }

  // public get<R extends RestEntity>(search ?: Object): Observable<RestCollection<R>>;

  /**
   * @param search
   * @returns {Observable<RestCollection<T>>}
   */
  public get(search: Object = {}): Observable<RestCollection<T>> {
    const url = this.url;
    const options = {headers: this.headers, params: this.getParams(search)};

    return this.httpClient.get<RestCollectionResponse<T>>(url, options)
      .pipe(
        map(data => this.extractDataCollection(data)),
        catchError(this.handleError)
      );
  }

  // public getOne<R extends RestEntity>(id: string, search: Object): Observable<R>;

  /**
   * @param {string} id
   * @param {Object} search
   * @returns {Observable<T extends RestEntity>}
   */
  public getOne(id: string, search: Object = {}): Observable<T> {
    const url = `${this.url}/${id}`;
    const options = {headers: this.headers, params: this.getParams(search)};

    return this.httpClient.get<RestEntity>(url, options)
      .pipe(
        map(data => this.extractData(data)),
        catchError(this.handleError)
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

    return this.httpClient.get<RestEntity>(url, options)
      .pipe(
        map(data => this.extractData(data)),
        catchError(this.handleError)
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

    return this.httpClient.post<RestEntity>(this.url, JSON.stringify(transformedEntity), options)
      .pipe(
        map(data => this.extractData(data)),
        catchError(this.handleError)
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
    const options = {headers: headers, params: this.getParams(search)};

    return this.httpClient.post<any>(this.url, formData, options)
      .pipe(
        catchError(this.handleError)
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

    return this.httpClient.patch<RestEntity>(url, JSON.stringify(transformedEntity), options)
      .pipe(
        catchError(this.handleError)
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

    return this.httpClient.put<RestEntity>(url, JSON.stringify(transformedEntity), options).pipe(
      catchError(this.handleError)
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
      catchError(this.handleError)
    );
  }

  /**
   * @param {RestCollectionResponse<T extends RestEntity>} response
   * @returns {RestCollection<T extends RestEntity>}
   */
  protected extractDataCollection(response: RestCollectionResponse<T>): RestCollection<T> {
    const data: RestCollection<T> = {items: [], total: 0};
    data.items = response['items'].map(entity => this.transform(entity));
    data.total = response['total'];

    return data;
  }

  /**
   * @param {RestEntity} response
   * @returns {T}
   */
  protected extractData(response: RestEntity): T {
    return this.transform(response);
  }

  /**
   * @param {HttpErrorResponse} errorResponse
   * @returns {Observable<any>}
   */
  protected handleError(errorResponse: HttpErrorResponse): Observable<any> {
    console.log(errorResponse);
    return errorResponse.status > 0 ? throwError(Object.assign(new RestErrorResponse(), errorResponse.error)) : throwError(errorResponse);
  }
}
