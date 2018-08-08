import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModel, ListConfig, ListCell } from 'ftm-pm/form-constructor';
import { Subscription } from 'rxjs';

import { User, UserFilterModel, UserListCells } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  public users: User[];
  public config: ListConfig;
  public listCells: ListCell[];
  public filterModel: FormModel;
  public queryParams: any;
  private subscription: Subscription;

  public constructor(private router: Router,
                     private route: ActivatedRoute,
                     private userService: UserService) {
    this.subscription = new Subscription();
    this.listCells = UserListCells;
    this.config = <ListConfig> {
      isSort: true,
      pageIndex: 0,
      pageSize: 10,
      filter: true,
      count: 21,
      fullSort: true,
      sortHeaders: ['lastname']
    };
    this.filterModel = UserFilterModel;
  }

  public ngOnInit(): void {
    this.queryParams = this.route.snapshot.queryParams;
    this.load();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public redirect(path: string[] = ['/404']): void {
    this.router.navigate(path);
  }

  public onPaginate(event): void {
    this.config.pageIndex = event.pageIndex + 1;
    this.config.pageSize = event.pageSize;
    this.load();
  }

  public onSorted(sort: Sort): void {
    this.config.pageIndex = 0;
    this.config.direction = sort.direction;
    this.config.sort = sort.active;
    this.load();
  }

  public onFiltersChanged(data: any): void {
    this.queryParams = {};
    for (const key of Object.keys(data)) {
      if (data[key] != null) {
        this.queryParams[key] = data[key][this.filterModel[key]['options']['mappedId']];
      }
    }
    this.router.navigate(['/list'], { queryParams: this.queryParams });
    this.load();
  }

  private load(): void {
    // this.subscription.add(this.userService.get(this.queryParams).subscribe(response => {
    //   this.config.count = response.items.length;
    //   }, error => {
    //     console.log('Error load count users');
    //   })
    // );
    this.subscription.add(this.userService.get(this.getSearch()).subscribe(response => {
        if (response) {
          this.users = response.items;
        }
      }, error => {
        console.log('Error load users');
      })
    );
  }

  private getSearch(): any {
    return {...this.queryParams, ...{
        '_page': this.config.pageIndex,
        '_limit': this.config.pageSize,
        '_sort': this.config.sort,
        '_order': this.config.direction
      }};
  }
}
