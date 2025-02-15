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
const manager_Refdata = '/manager/refdata';
export const manager_refData_links = [
  {
    link: `${manager_Refdata}/client`,
    caption: `Клиенты`,
  },
  {
    link: `${manager_Refdata}/contract`,
    caption: `Контракты`,
  },
  {
    link: `${manager_Refdata}/unit`,
    caption: `Ед.Измер`,
  },

  {
    link: `${manager_Refdata}/productgroup`,
    caption: `Группа товаров`,
  },

  {
    link: `${manager_Refdata}/producttype`,
    caption: `Тип товара`,
  },

  {
    link: `${manager_Refdata}/products`,
    caption: `Товары`,
  },

  {
    link: `${manager_Refdata}/servicework-group`,
    caption: `Группы работ`,
  },

  {
    link: `${manager_Refdata}/thirdpartyservice-group`,
    caption: `Группы работ сторонние`,
  },

  {
    link: `${manager_Refdata}/serviceworks`,
    caption: `Наши работы(услуги)`,
  },

  {
    link: `${manager_Refdata}/thirdpartyservices`,
    caption: `Сторонние работы(услуги)`,
  },
];

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const manager_Docums = '/manager/documents';
export const manager_Docums_links = [
  {
    link: `${manager_Docums}/calculation`,
    caption: `Калькуляции`,
  },
  {
    link: `${manager_Docums}/nakladnaya`,
    caption: `Накладные`,
  },

  {
    link: `${manager_Docums}/akt-of-work`,
    caption: `Акты`,
  },
  {
    link: `${manager_Docums}/calendarn-grafik`,
    caption: `Календ График`,
  },
  {
    link: `${manager_Docums}/nakl-rems`,
    caption: `Накл Ремс`,
  },
  {
    link: `${manager_Docums}/akt-rems-musor`,
    caption: `Акт Ремс Мусор`,
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
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const accountant_Refdata = '/accountant/refdata';
export const accountant_refData_links = [
  {
    link: `${accountant_Refdata}/worker-profession`,
    caption: `Профессии`,
  },
  {
    link: `${accountant_Refdata}/workers`,
    caption: `Работники`,
  },
  {
    link: `${accountant_Refdata}/storehouse`,
    caption: `Склады`,
  },
  {
    link: `${accountant_Refdata}/client-type`,
    caption: `Тип Клиента`,
  },
  {
    link: `${accountant_Refdata}/contract-type`,
    caption: `Тип Контракта`,
  },

  {
    link: `${accountant_Refdata}/firm-type`,
    caption: `Тип Фирмы`,
  },
  {
    link: `${accountant_Refdata}/payment-source`,
    caption: `Источник Средств`,
  },
  {
    link: `${accountant_Refdata}/taxation-type`,
    caption: `Налогооблажение`,
  },
  {
    link: `${accountant_Refdata}/cash-register`,
    caption: `Кассы`,
  },
  {
    link: `${accountant_Refdata}/cash-flow-type`,
    caption: `Тип Операции Кассы`,
  },
];

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const accountant_Money = '/accountant/money';
export const accountant_Money_links = [
  {
    link: `${accountant_Money}/cash-flow`,
    caption: `Движ. Кассы`,
  },
];

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

export const arr__typeNakl = [
  { _id: 'incoming', caption: 'Прибуткова накладна', prefix: '№ ПН-' },
  { _id: 'outgoing', caption: 'Видаткова накладна', prefix: '№ ВН-' },
  {
    _id: 'returnFromBuyer',
    caption: 'Накладна - Повернення клієнта',
    prefix: '№ НПК-',
  },
  {
    _id: 'returnToSupplier',
    caption: 'Накладна - Повернення постачальнику',
    prefix: '№ НПП-',
  },
];

export const arr__typeAkt = [
  {
    _id: 'incoming',
    caption: 'Вхідний акт виконаних робіт',
    prefix: '№ ВАВР-',
  },
  {
    _id: 'outgoing',
    caption: 'АКТ виконаних робіт (послуг) ',
    prefix: '№ АВР-',
  },
];

export const arr__typeInvoice = [
  {
    _id: 'incoming',
    caption: 'Вхідний рахунок',
    prefix: '№ ВР-',
  },
  {
    _id: 'outgoing',
    caption: 'Рахунок - фактура',
    prefix: '№ СФ-',
  },
];

export const arr__TypeOfOSBB = ['ЖБК', 'ЖСК', 'ОСББ'];

export const monthsWorkBudjet = [
  { _id: 'січень', caption: 'січень' },
  { _id: 'лютий', caption: 'лютий' },
  { _id: 'березень', caption: 'березень' },
  { _id: 'квітень', caption: 'квітень' },
  { _id: 'травень', caption: 'травень' },
  { _id: 'червень', caption: 'червень' },
  { _id: 'липень', caption: 'липень' },
  { _id: 'серпень', caption: 'серпень' },
  { _id: 'вересень', caption: 'вересень' },
  { _id: 'жовтень', caption: 'жовтень' },
  { _id: 'листопад', caption: 'листопад' },
  { _id: 'грудень', caption: 'грудень' },
];

export const arr_paymentProectnAvt = [
  { _id: 'собств', caption: 'собств' },
  { _id: 'бюджет', caption: 'бюджет' },
];

export const arr__incomeOrExpense = [
  {
    _id: 'income',
    caption: 'Приход',
  },
  {
    _id: 'expense',
    caption: 'Расход',
  },
];
