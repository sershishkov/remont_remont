import type { Metadata } from 'next';
import { ParamsProps } from '@/interfaces/CommonInterfaces';
import PaySourceAddEdit from '../PaySourceAddEdit';

const title = 'Редактировать Источник средств';

export const metadata: Metadata = {
  title: title,
};

export default async function PaymentSourceEdit({
  params,
}: Readonly<ParamsProps>) {
  const { id } = await params;
  return <PaySourceAddEdit id={id} mode='edit' title={title} />;
}
