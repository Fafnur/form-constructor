import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import * as moment_ from 'moment/moment';
const moment = moment_;

export interface ListConfig {
  responsive?: boolean;
  isSort?: boolean;
  fullSort?: boolean;
  pageSizeOptions?: number[];
  count?: number;
  pageSize?: number;
  pageIndex?: number;
  translatePrefix?: string;
  columns?: string[];
  excludedFields?: string[];
  filter?: boolean;
  sort ?: string;
  sorts ?: string[];
  direction ?: string;
}

export interface NodeCell {
  columnDef: string;
  type: string;
  header?: string;
  usePrefix?: boolean;
  isNullValue?: string;

  dataName?(row): string;
}

export function transformList(columns: any[], isNullValue: string = '-'): NodeCell[] {
  const cells = columns.filter(item => typeof item === 'string' || item.type !== 'config').map(item => {
    let conf = item;
    if (typeof item === 'string') {
      conf = <ListConfig> {
        columnDef: item,
        type: 'text',
        header: item,
        usePrefix: true,
        dataName: (row) => {
          if (typeof row === 'object') {
            return row[item];
          } else if (row) {
            return row;
          } else {
            return isNullValue;
          }
        }
      };
    } else {
      if (!item.header) {
        item.header = item.columnDef;
      }
      if (item.usePrefix == null) {
        item.usePrefix = true;
      }
      if (typeof item.dataName !== 'function') {
        item.dataName = (row) => {
          if (typeof row === 'object') {
            return row[item];
          } else if (row) {
            return row;
          } else {
            return item.isNullValue ? item.isNullValue : isNullValue;
          }
        };
      }
      switch (item.type) {
        case 'bool':
          item.dataName = (row) => {
            if (typeof row === 'object') {
              return !!row[item];
            } else if (row != null) {
              return row;
            } else {
              return false;
            }
          };
          break;
        case 'date':
          item.dataName = (row) => {
            if (typeof row === 'object') {
              if (row[item]) {
                return moment(new Date(row[item]));
              } else {
                return moment(new Date());
              }
            } else if (row) {
              return moment(new Date(row));
            } else {
              return moment(new Date());
            }
          };
          break;
      }
    }

    return conf;
  });
  const confs =  columns.filter(item => typeof item === 'object' && item.type === 'config');
  cells['_config'] = confs.length ? confs[0] : {};

  return cells;
}

@Component({
  selector: 'fc-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnChanges {
  @Input() public data: any;
  @Input() public config: ListConfig;
  @Input() public nodeList: NodeCell[];
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;
  @Output() private sorted: EventEmitter<Sort> = new EventEmitter<Sort>();
  @Output() private pageEvent: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  public ngOnInit() {
  }

  public ngOnChanges(): void {
    this.config = this.getConfig();
    if (this.nodeList != null && this.data != null && this.config != null) {
      this.dataSource = new MatTableDataSource(this.data);
      if (this.config.columns.length) {
        this.displayedColumns = this.config.columns;
      } else {
        this.displayedColumns = this.nodeList
          .filter(item => item.columnDef && this.config.excludedFields.indexOf(item.columnDef) < 0)
          .map(x => x.columnDef);
      }
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.paginator.pageSize = this.config.pageSize;
      // this.dataSource.paginator.pageIndex = this.config.pageIndex;
      // this.dataSource.paginator.length = 122;
      if (!this.config.fullSort) {
        this.dataSource.sort = this.sort;
      }
    }
  }

  public applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public onPaginate(event: PageEvent): void {
    this.config.pageSize = event.pageSize;
    this.config.pageIndex = event.pageIndex + 1;
    this.pageEvent.emit(event);
  }

  public getIndex(i): void {
    return i + 1 + (this.config.pageIndex > 0 ? this.config.pageIndex - 1 : 0) * this.config.pageSize;
  }

  public getHeader(column: NodeCell, header: string = null, action: boolean = null): string {
    if (header === null) {
      header = column.header;
    }
    if (action === null) {
      action = column.usePrefix;
    }
    return action ? `${this.config.translatePrefix}${header}` : header;
  }

  public sortData(sort: Sort): void {
    if (!this.config.fullSort) {
      this.dataSource.sort = this.sort;
    }
    // this.dataSource.paginator.pageIndex = 0;
    this.sorted.emit(sort);
  }

  private getConfig(): ListConfig {
    return <ListConfig> {
      ...{
        count: 0,
        columns: [],
        responsive: true,
        filter: true,
        isSort: true,
        excludedFields: [],
        fullSort: false,
        pageSizeOptions: [5, 10, 15, 25],
        pageSize: 10,
        pageIndex: 0,
      }, ...this.nodeList['_config'], ...this.config
    };
  }
}
