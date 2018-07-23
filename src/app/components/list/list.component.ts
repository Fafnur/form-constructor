import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ListConfig, NodeCell } from 'ftm-pm/form-constructor';
import { Subscription } from 'rxjs';

import { User, UserList } from '../../models/user';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  public users: User[];
  public count: number = 0;
  public page: number = 1;
  public limit: number = 15;
  public tableConfig: ListConfig;
  public nodeList: NodeCell[];
  private subscription: Subscription;

  public constructor(private router: Router,
                     private route: ActivatedRoute,
                     private userService: UserService) {
    this.subscription = new Subscription();
    this.nodeList = UserList;
    this.tableConfig = <ListConfig> {
      isSort: true,
      pageIndex: 0,
      pageSize: 10,
      translatePrefix: 'user.form.',
      fullSort: true
    };
  }

  public ngOnInit(): void {
    this.subscription.add(this.userService.get().subscribe(response => {
      if (response instanceof HttpErrorResponse) {
        this.redirect(['/500']);
      }
      if (response) {
        this.tableConfig.count = response.length;
      }
    }));
    this.load();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public redirect(path: string[] = ['/404']): void {
    this.router.navigate(path);
  }

  public onPaginate(event): void {
    this.tableConfig.pageIndex = event.pageIndex + 1;
    this.tableConfig.pageSize = event.pageSize;
    this.load();
  }

  public onSorted(sort: Sort): void {
    this.tableConfig.pageIndex = 0;
    this.tableConfig.direction = sort.direction;
    this.tableConfig.sort = sort.active;
    this.load();
  }

  private load(): void {
    this.subscription.add(this.userService.get({
      '_page': this.tableConfig.pageIndex,
      '_limit': this.tableConfig.pageSize,
      '_sort': this.tableConfig.sort,
      '_order': this.tableConfig.direction
    }).subscribe(response => {
        if (response instanceof HttpErrorResponse) {
          this.redirect(['/500']);
        }
        if (response) {
          this.users = response;
        }
      })
    );
  }
}
