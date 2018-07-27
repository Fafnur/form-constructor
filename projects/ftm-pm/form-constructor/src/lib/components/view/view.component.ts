import { Component, HostBinding, Input, OnInit } from '@angular/core';
import * as moment_ from 'moment/moment';
const moment = moment_;

import { NodeCell } from '../list/list.component';

export interface ViewConfig {
  translatePrefix?: string;
  classes?: string;
  level?: number;
  columns?: string[];
  excludedFields?: string[];
}

export interface ViewCell {
  columnDef: string;
  type: string;
  header?: string;
  usePrefix?: boolean;
  isNullValue?: string;
  subProperty?: boolean;
  levelType?: number;

  dataName?(value: any, column ?: string, entity ?: any): string;
}

export function transformView(columns: any[], isNullValue: string = '-'): NodeCell[] {
  const cells = columns.filter(item => typeof item === 'string' || item.type !== 'config').map(item => {
    let conf = item;
    if (typeof item === 'string') {
      conf = <ViewCell> {
        columnDef: item,
        type: 'text',
        header: item,
        usePrefix: true,
        subProperty: false,
        dataName: (value) => {
          if (value != null) {
            return value;
          } else {
            return isNullValue;
          }
        }
      };
    } else {
      if (!item.header) {
        item.header = item.columnDef;
      }
      if (item.subProperty == null) {
        item.subProperty = false;
      } else {
        if (item.levelType == null) {
          item.levelType = 0;
        }
      }
      if (item.usePrefix == null) {
        item.usePrefix = true;
      }
      switch (item.type) {
        case 'bool':
          item.dataName = (value, column, entity) => {
           if (value != null) {
              return !!value;
            } else {
              return item.isNullValue ? item.isNullValue : isNullValue;
            }
          };
          break;
        case 'date':
          item.dataName = (value, column, entity) => {
            if (value != null) {
              return moment(new Date(value));
            } else {
              return item.isNullValue ? item.isNullValue : isNullValue;
            }
          };
          break;
        case 'child':
          item.dataName = (value, column, entity) => {
            return item.isNullValue ? item.isNullValue : isNullValue;
          };
          break;
        default: {
          item.dataName = (value, column, entity) => {
            if (value != null) {
              return value;
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
    return this.node[column].dataName(this.data[column], column, this.data);
  }

  public getChildConfig(column: string): Object {
    return {...this.node[column].config, ...{level: this.config.level + 1, classes: this.config.classes + ' fc-view-group_child' }};
  }

  public getPropertyLevel(column: string): number {
    let level = this.config.level;
    switch (this.node[column]['levelType']) {
      case 1:
        if (this.node[column]['property']) {
          level += this.node[column]['property'].split('.').length;
        }
        break;
      case 2:
        level = this.node[column]['level'];
        break;
      case 3:
        level += this.node[column]['level'];
        break;
    }

    return level;
  }

  public displayPropertyView(column: string): any {
    let val = this.data;

    if (this.node[column]['property'] && val != null) {
      const paths =  this.node[column]['property'].split('.');
      for (const path of paths) {
        if (val.hasOwnProperty(path)) {
          val = val[path];
        } else {
          break;
        }
      }
    }

    return this.node[column].dataName(val, column, this.data);
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
