import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { NodeCell } from '../list/list.component';

export interface ViewConfig {
  translatePrefix?: string;
  columns?: string[];
}

@Component({
  selector: 'fc-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  @Input() public data: any;
  @Input() public config: ViewConfig;
  @Input() public nodeList: NodeCell[];
  public displayedColumns: string[];
  @HostBinding('attr.class') public class = 'fc-view';

  private node: Object;

  public constructor() { }

  public ngOnInit(): void {
    this.node = {};
    this.nodeList.forEach(item => {
      this.node[item.columnDef] = item;
    });
    if (this.config.columns && this.config.columns.length) {
      this.displayedColumns = this.config.columns;
    } else {
      this.displayedColumns = this.nodeList.map(x => x.columnDef);
    }
  }

  public displayView(column: string): any {
    return this.node[column].dataName(this.data[column]);
  }
}
