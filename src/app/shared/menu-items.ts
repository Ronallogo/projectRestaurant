import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  role: string;
}

const MENUITEMS = [
  {
    state: 'dashboard',
    name: 'Tableau de bord',
    type: 'link',
    icon: 'dashboard',
    role: '',
  },

  {
    state: 'category',
    name: 'Gestion gatégories',
    type: 'link',
    icon: 'category',
    role: 'admin',
  },

  {
    state: 'product',
    name: 'Gestion produits',
    type: 'link',
    icon: 'inventory_2',
    role: 'admin',
  },


  {
    state: 'order',
    name: 'Gestion commandes',
    type: 'link',
    icon: 'shopping_cart',
    role: '',
  },

  {
    state: 'bill',
    name: 'Voir Factures',
    type: 'link',
    icon: 'backup_table',
    role: '',
  },

  {
    state: 'user',
    name: 'Gestion Utilisateurs',
    type: 'link',
    icon: 'people',
    role: 'admin',
  }

];

@Injectable()
export class MenuItems {
  getMenuItems(): Menu[] {
    return MENUITEMS;


  }
}
