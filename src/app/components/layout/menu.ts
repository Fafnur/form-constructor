export interface MenuItem {
  path: string;
  label: string;
  icon: string;
  hidden ?: boolean;
  disabled ?: boolean;
}

export const menu: MenuItem[] = [
  {
    path: '/dashboard',
    label: 'menu.dashboard',
    icon: 'home',
  },
  {
    path: '/list',
    label: 'menu.list',
    icon: 'home',
  },
  {
    path: '/modified-list',
    label: 'menu.modifiedList',
    icon: 'home',
  },
  {
    path: '/view',
    label: 'menu.view',
    icon: 'home',
  },
  {
    path: '/edit',
    label: 'menu.edit',
    icon: 'home',
  },
];
