import type { Metadata } from 'next';
import { paramsProps } from '@/interfaces/CommonInterfaces';
import CalculationAddEdit from '../CalculationAddEdit';

const title = 'Редактировать Калькуляцию';

export const metadata: Metadata = {
  title: title,
};

export default function CalculationEditPage({ params }: Readonly<paramsProps>) {
  const { id } = params;
  return <CalculationAddEdit id={id} mode='edit' title={title} />;
}
