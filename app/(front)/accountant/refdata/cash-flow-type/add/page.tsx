import type { Metadata } from 'next';

import CashRegisterEdit from '../CashFlowTypeAddEdit';

const title = 'Создать Тип Операции';

export const metadata: Metadata = {
  title: title,
};

export default function CashRegisterAdd() {
  return <CashRegisterEdit mode='add' title={title} />;
}
