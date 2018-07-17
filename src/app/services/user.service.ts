import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from './rest.service';

import { environment } from '../../environments/environment';
import { User } from '../models/user';

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
    return Object.assign(new User(), data);
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
