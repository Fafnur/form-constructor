import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from './rest.service';

import { environment } from '../../environments/environment';
import { User, UserInfo } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends RestService<User> {
  /**
   * @param {HttpClient} httpClient
   */
  public constructor(protected httpClient: HttpClient) {
    super(`${environment.api.path}${environment.api.prefix}/users`);
  }

  public static transform(data: any): User {
    const entity: User = Object.assign(new User(), data);
    if (data.info) {
      entity.info = Object.assign(new UserInfo(), data.info);
    }

    return entity;
  }

  public static reverseTransform(user: User): any {
    return user;
  }

  public transform(data: any): User {
    return UserService.transform(data);
  }

  public reverseTransform(entity: any): any {
    return UserService.reverseTransform(entity);
  }
}
