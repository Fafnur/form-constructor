import { Component, HostBinding, Input, OnInit } from '@angular/core';
import * as moment_ from 'moment/moment';
const moment = moment_;

import { NodeCell } from '../list/list.component';
import { ListConfig } from '../list/list.component';

export interface ViewConfig {
  translatePrefix?: string;
  classes?: string;
  level?: number;
  columns?: string[];
  excludedFields?: string[];
}

export function transformView(columns: any[], isNullValue: string = '-'): NodeCell[] {
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
        case 'child':
          item.dataName = (row) => {
            return item.isNullValue ? item.isNullValue : isNullValue;
          };
          break;
        default: {
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
      }
    }

    return conf;
  });
  const confs =  columns.filter(item => typeof item === 'object' && item.type === 'config');
  cells['_config'] = confs.length ? confs[0] : {};

  return cells;
}

@Component({
  selector: 'fc-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  @Input() public data: any;
  @Input() public config: ViewConfig = {};
  @Input() public nodeList: NodeCell[];
  public displayedColumns: string[];
  @HostBinding('attr.class') public class = 'fc-view';
  public node: Object;

  public constructor() { }

  public ngOnInit(): void {
    this.config = this.getConfig();
    this.node = {};
    this.nodeList.forEach(item => {
      this.node[item.columnDef] = item;
    });
    if (this.config.columns.length) {
      this.displayedColumns = this.config.columns;
    } else {
      this.displayedColumns = this.nodeList
        .filter(item => item.columnDef && this.config.excludedFields.indexOf(item.columnDef) < 0)
        .map(x => x.columnDef);
    }
  }

  public displayView(column: string): any {
    return this.node[column].dataName(this.data[column]);
  }

  public getChildConfig(column: string): Object {
    return {...this.node[column].config, ...{level: this.config.level + 1, classes: this.config.classes + ' fc-view-group_child' }};
  }

  private getConfig(): ViewConfig {
    if (!this.nodeList.hasOwnProperty('_config')) {
      this.nodeList['_config'] = {};
    }
    return <ViewConfig> {
      ...{
        classes: '',
        level: 0,
        columns: [],
        excludedFields: []
      }, ...this.nodeList['_config'], ...this.config
    };
  }
}
