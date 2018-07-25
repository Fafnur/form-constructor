import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModel, FormNode, FormNodeConfig } from 'ftm-pm/form-constructor';
import { Subscription } from 'rxjs';

import { User, UserModel } from '../../models/user';
import { UserService } from '../../services/user.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  public user: User;
  public formNode: FormNode;
  public formModel: FormModel;
  public form: any;
  public formNodeConfig: FormNodeConfig;
  public submitted: boolean;
  private subscription: Subscription;

  public constructor(private route: ActivatedRoute,
                     private router: Router,
                     private userService: UserService,
                     public snackBar: MatSnackBar) {
    this.subscription = new Subscription();
    this.formModel = UserModel;
    this.formModel['client']['options']['expansionPanel']['options']['button']['label'] = 'actions.edit';

    this.formNodeConfig = {
      excludedFields: ['id'],
      childrenConfig: {
        client: {
          localePrefix: 'client.form.',
          excludedFields: ['id'],
        }
      }
    };
    this.submitted = false;
  }

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/users', 1, 'edit']);
    }
    this.subscription.add(this.userService.getOne(id).subscribe(response => {
      if (response instanceof HttpErrorResponse) {
        this.redirect(['/500']);
      }
      if (response ) {
        this.user = response;
        if (this.formNode) {
          this.setData();
        }
      }
    }));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public redirect(paths: any[] = ['/404']): void {
    this.router.navigate(paths);
  }

  public onCreated(formNode: FormNode): void {
    this.formNode = formNode;
    if (this.user) {
      this.setData();
    }
  }

  public onSubmit(event): void {
    const user: User = {...this.user, ...<User> this.formNode.getData()};
    user.id = this.user.id;
    this.submitted = true;
    this.subscription.add(this.userService.put(user).subscribe(response => {
      if (response instanceof HttpErrorResponse) {
        this.redirect(['/500']);
      }
      if (response) {
        this.submitted = false;
        this.snackBar.openFromComponent(NotificationComponent, {
          duration: 1500,
          data: {
            message: 'status.saved'
          }
        });
      }
    }, error => {
      this.submitted = false;
    }));
  }

  private setData(): void {
    if (this.formNode && this.user) {
      this.formNode.setData(this.user);
    }
  }
}
