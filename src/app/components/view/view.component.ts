import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NodeCell, ViewConfig } from 'ftm-pm/form-constructor';
import { Subscription } from 'rxjs';

import { User, UserList } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {
  public user: User;
  public nodeList: NodeCell[];
  public viewConfig: ViewConfig;
  private subscription: Subscription;

  public constructor(private route: ActivatedRoute,
                     private router: Router,
                     private userService: UserService) {
    this.subscription = new Subscription();
    this.nodeList = UserList;
    this.viewConfig = {
      translatePrefix: 'user.form.',
      excludedFields: ['id', 'number', 'numberRequests', 'actions']
      // columns:  ['id', 'lastname', 'firstname']
    };
  }

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.redirect(['/users', 1, 'view']);
    }
    this.subscription.add(this.userService.getOne(id).subscribe(response => {
      if (response instanceof HttpErrorResponse) {
        this.redirect(['/500']);
      }
      if (response ) {
        this.user = response;
      }
    }));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public redirect(paths: any[] = ['/404']): void {
    this.router.navigate(paths);
  }
}
