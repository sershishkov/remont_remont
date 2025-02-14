export const roles = [
  {
    _id: 'user',
    caption: 'Пользователь',
  },
  {
    _id: 'client',
    caption: 'Клиент',
  },
  {
    _id: 'worker',
    caption: 'Работник',
  },
  {
    _id: 'manager',
    caption: 'Менеджер',
  },
  {
    _id: 'boss',
    caption: 'Руководитель',
  },
  {
    _id: 'accountant',
    caption: 'Бухгалтер',
  },
  {
    _id: 'admin',
    caption: 'Admin',
  },
];

export const all_roles = [
  'user',
  'client',
  'worker',
  'manager',
  'boss',
  'accountant',
  'admin',
];

export const client_role = ['client', 'manager', 'boss', 'accountant', 'admin'];

export const worker_role = ['worker', 'manager', 'boss', 'accountant', 'admin'];

export const manager_role = ['manager', 'boss', 'accountant', 'admin'];

export const boss_role = ['boss', 'accountant', 'admin'];

export const accountant_role = ['accountant', 'admin'];

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const calculation_services = '/user/calculation/services';
export const calculation_services_links = [
  {
    link: `${calculation_services}/asfalt`,
    caption: `Асфальтирование`,
  },
  {
    link: `${calculation_services}/tr_plitka`,
    caption: `Тротуарная плитка`,
  },
];

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

const mainAdmin = '/admin';
export const admin_links = [
  {
    link: `${mainAdmin}/users`,
    caption: `Пользователи`,
  },
];
