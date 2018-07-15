import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';

export interface ListConfig {
  title?: string;
  responsive?: boolean;
  sort?: boolean;
  pageSizeOptions?: number[];
  count?: number;
  pageSize?: number;
  pageIndex?: number;
  translatePrefix?: string;
}

export interface ListCell {
  columnDef?: string;
  type?: string;
  header?: string;
  usePrefix?: boolean;

  dataName?(row): string;
}

export function transformList(columns: any[]): ListCell[] {
  return columns.map(item => {
    let conf = item;
    if (typeof item === 'string') {
      conf = <ListConfig> {
        columnDef: item,
        type: 'text',
        header: item,
        usePrefix: true,
        dataName: (row) => row[item] || ''
      };
    }

    return conf;
  });
}

@Component({
  selector: 'fc-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnChanges {
  @Input() public data: any;
  @Input() public config: ListConfig;
  @Input() public columns: any[] = [];
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;
  @Output() private clickedItem = new EventEmitter();
  @Output() private pageEvent = new EventEmitter<PageEvent>();

  public ngOnInit() {
    this.config = {
      ... <ListConfig>{
        count: 0,
        responsive: true,
        sort: false,
        pageSizeOptions: [5, 10, 15, 25],
        pageSize: 10,
        pageIndex: 0
      }, ...this.config
    };
  }

  public ngOnChanges(): void {
    if (this.columns != null && this.data != null) {
      this.dataSource = new MatTableDataSource(this.data);
      this.displayedColumns = this.columns.map(x => x.columnDef);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.paginator.pageSize = this.config.pageSize;
      // this.dataSource.paginator.pageIndex = this.config.pageIndex;
      // this.dataSource.paginator.length = 122;
      this.dataSource.sort = this.sort;
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

  public viewItem(guid): void {
    this.clickedItem.emit(guid);
  }

  public getIndex(i): void {
    return i + 1 + (this.config.pageIndex > 0 ? this.config.pageIndex - 1 : 0) * this.config.pageSize;
  }

  public getHeader(column: ListCell, header: string = null, action: boolean = null): string {
    if (header === null) {
      header = column.header;
    }
    if (action === null) {
      action = column.usePrefix;
    }
    return action ? `${this.config.translatePrefix}${header}` : header;
  }
}
