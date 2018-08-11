import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange, MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
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
  sort?: string;
  sorts?: string[];
  direction?: string;
  sortHeaders?: string[];
  excludedSortHeaders?: string[];
  search?: Object;
  groups?: string[];
  actions?: any[];
}

export interface ListCell {
  columnDef: string;
  style: Object;
  format ?: string;
  type: string;
  header?: string;
  usePrefix?: boolean;
  isNullValue?: string;
  actions?: any[];

  getAction?(): any;

  dataName?(row, colunm ?: ListCell, data ?: any): string;
}

export interface ActionResponse {
  data: Object;
  action: Object;
  cell: ListCell;
  event ?: any;
}

export interface GroupActionResponse {
  data: boolean[];
  action: Object;
  cell: ListCell;
  event ?: any;
}

export function transformList(columns: any[], isNullValue: string = '-'): ListCell[] {
  const cells = columns.map(item => {
    let conf = item;
    if (typeof item === 'string') {
      conf = <ListConfig> {
        columnDef: item,
        style: {},
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
    } else if (typeof item === 'object' && item.type === 'config') {
      return conf;
    } else {
      if (!item.header) {
        item.header = item.columnDef;
      }
      if (!item.style) {
        item.style = {};
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
  const confs = columns.filter(item => typeof item === 'object' && item.type === 'config');
  if (!confs.length) {
    cells.push({type: 'config'});
  }

  return cells;
}

@Component({
  selector: 'fc-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnChanges {
  @Input() public data: any[];
  @Input() public config: ListConfig;
  @Input() public listCells: ListCell[];
  public displayedColumns: string[];
  public isGroupActions: boolean;
  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;
  @Output() public sorted: EventEmitter<Sort> = new EventEmitter<Sort>();
  @Output() public pageEvent: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  @Output() public action: EventEmitter<ActionResponse> = new EventEmitter<ActionResponse>();
  @Output() public groupAction: EventEmitter<GroupActionResponse> = new EventEmitter<GroupActionResponse>();
  public node: Object;
  public forms: any = {};
  public formsSelectAll: any = {};
  @HostBinding('attr.class') public class = 'fc-list';

  public constructor(protected translateService: TranslateService) {
  }

  public ngOnInit() {

  }

  public ngOnChanges(): void {
    this.config = this.getConfig();
    if (this.listCells != null && this.data != null && this.config != null) {
      this.dataSource = new MatTableDataSource(this.data);
      if (this.config.columns.length) {
        this.displayedColumns = this.config.columns;
      } else {
        this.displayedColumns = this.listCells
          .filter(item => item.columnDef && this.config.excludedFields.indexOf(item.columnDef) < 0)
          .map(x => x.columnDef);
      }

      const total = this.data.length;
      this.listCells.filter(cell => cell.type === 'checkbox').forEach(cell => {
        const formConfig: Object = {};
        this.forms[cell.columnDef] = [];
        for (let i = 0; i < total; i++) {
          this.forms[cell.columnDef][i] = false;
        }
      });
      this.isGroupActions = Object.keys(this.forms).length > 0;

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
    for (const key of Object.keys(this.formsSelectAll)) {
      this.formsSelectAll[key] = false;
    }
    this.config.pageSize = event.pageSize;
    this.config.pageIndex = event.pageIndex;
    this.pageEvent.emit(event);
  }

  public getIndex(i): void {
    return i + 1 + this.config.pageIndex * this.config.pageSize;
  }

  public getHeader(column: ListCell, header: string = null, action: boolean = null): string {
    if (header == null) {
      header = column.header;
    }
    if (action == null) {
      action = column.usePrefix;
    }
    return action ? `${this.config.translatePrefix}${header}` : header;
  }

  public onSelect(event: MatCheckboxChange, cell: ListCell): void {
    this.formsSelectAll[cell.columnDef] = false;
  }

  public onSelectAllToggle(event: MatCheckboxChange, cell: ListCell): void {
    const total = this.data.length;
    for (let i = 0; i < total; i++) {
      this.forms[cell.columnDef][i] = event.checked;
    }
  }

  public clearSelect(selectId: string): void {
    const total = this.data.length;
    for (let i = 0; i < total; i++) {
      this.forms[selectId][i] = false;
    }
    this.formsSelectAll[selectId] = false;
  }

  public getSelectAllHeader(column: ListCell, header: string = null, action: boolean = null): string {
    if (!header && column.header == null && this.config['selectAllLabel']) {
      header = this.config['selectAllLabel'];
    }
    if (action == null) {
      action = column.usePrefix;
    }
    return action ? `${this.config.translatePrefix}${header}` : header ? header : '';
  }

  public sortData(sort: Sort): void {
    if (!this.config.fullSort) {
      this.dataSource.sort = this.sort;
    } else if (sort.active) {
      // this.data = [];
      this.paginator.firstPage();
    }
    this.sorted.emit(sort);
  }

  public getActionLink(column: any, action: any, row: any): any {
    if (action && typeof action.getAction === 'function') {
      return action.getAction(action, row);
    } else if (column && typeof column.getAction === 'function') {
      return column.getAction(action, row);
    } else {
      return ['/'];
    }
  }

  public onAction(data: Object, action: any, cell: ListCell, event): void {
    this.action.emit({
      data: data,
      action: action,
      cell: cell,
      event: event
    });
  }

  public getGroupActionLink(column: any, action: any): any {
    if (action && typeof action.getAction === 'function') {
      return action.getAction(action, this.forms[column.columnDef]);
    } else if (column && typeof column.getAction === 'function') {
      return column.getAction(action, this.forms[column.columnDef]);
    } else {
      return ['/'];
    }
  }

  public getDataName(row, column): string {
    return column.dataName(row, column, this.data, this.translateService);
  }

  public onGroupAction(action: any, cell: ListCell, event): void {
    this.groupAction.emit({
      data: this.forms[cell.columnDef],
      action: action,
      cell: cell,
      event: event
    });
  }

  public isGroupActionActive(cell: ListCell): boolean {
    return this.forms[cell.columnDef].filter(item => item).length > 0;
  }

  private getConfig(): ListConfig {
    if (!this.config) {
      this.config = {};
    }
    this.node = {};
    if (this.listCells) {
      this.listCells.forEach(item => {
        if (item.columnDef) {
          this.node[item.columnDef] = item;
        }
      });
    }
    this.config = <ListConfig> {
      ...{
        count: 0,
        columns: [],
        actions: [],
        sortHeaders: [],
        excludedSortHeaders: [],
        responsive: true,
        filter: false,
        isSort: true,
        selectAllLabel: 'list.selectAll',
        excludedFields: [],
        fullSort: false,
        pageSizeOptions: [5, 10, 15, 25],
        pageSize: 10,
        pageIndex: 0
      }, ...this.findConfig(), ...this.config
    };

    if (this.listCells && this.listCells.length) {
      if (!this.config.sortHeaders.length) {
        this.config.sortHeaders = this.listCells
          .filter(item => item.columnDef && this.config.excludedFields.indexOf(item.columnDef) < 0)
          .map(item => item.columnDef);
      } else {
        this.config.sortHeaders = this.config.sortHeaders.filter(item => this.config.excludedFields.indexOf(item) < 0 && !!this.node[item]);
      }
    }

    return this.config;
  }

  private findConfig(): ListConfig {
    const confs = this.listCells ? this.listCells.filter(item => item.type === 'config') : [];

    return confs.length ? <ListConfig>confs[0] : <ListConfig> {type: 'config'};
  }
}
