export interface RestEntity {
  id: number;
}

export interface Timestampable extends RestEntity {
  createdAt: Date;
  updatedAt: Date;
}

export class RestEntity implements RestEntity {
  public id: number;
}

export class TimestampableRestEntity extends RestEntity implements Timestampable {
  public createdAt: Date;
  public updatedAt: Date;
}
