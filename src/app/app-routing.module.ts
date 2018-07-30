import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditComponent } from './components/edit/edit.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ListComponent } from './components/list/list.component';
import { ModifiedListComponent } from './components/modified-list/modified-list.component';
import { ViewComponent } from './components/view/view.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'list',
        component: ListComponent
      },
      {
        path: 'modified-list',
        component: ModifiedListComponent
      },
      {
        path: 'users/:id/edit',
        component: EditComponent
      },
      {
        path: 'edit',
        component: EditComponent
      },
      {
        path: 'users/:id/view',
        component: ViewComponent
      },
      {
        path: 'view',
        component: ViewComponent
      },
      {
        path: '500',
        component: ServerErrorComponent
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
