export interface RestEntity {
  id: string;
}

export interface Timestampable extends RestEntity {
  createdAt: Date;
  updatedAt: Date;
}

export interface RestCollectionResponse<T extends RestEntity> {
  'hydra:member': T[];
  'hydra:totalItems'?: number;
  'hydra:search'?: any;
}

export interface RestErrorResponse {
  'hydra:title': string;
  'hydra:description': string;
  trace ?: any[];
}

export class RestErrorResponse implements RestErrorResponse {
  public 'hydra:title': string;
  public 'hydra:description': string;
  public trace ?: any[];

  get message(): string {
    return this['hydra:description'];
  }

  get title(): string {
    return this['hydra:title'];
  }
}

export interface RestCollection<T extends RestEntity> {
  items: T[];
  total?: number;
}

export class RestEntity implements RestEntity {
  public id: string;
}

export class TimestampableRestEntity extends RestEntity implements Timestampable {
  public createdAt: Date;
  public updatedAt: Date;
}
