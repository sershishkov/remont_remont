import type { Metadata } from 'next';

import MyIconButtonAdd from '@/components/common/MyIconButtonAdd';
import CalculationList from './CalculationList';

const title = 'Кошториси';
const currentURL = `/manager/calculation`;

export const metadata: Metadata = {
  title: title,
};

export default function CalculationPage() {
  return (
    <>
      <MyIconButtonAdd href={`${currentURL}/add`} />
      <CalculationList currentURL={currentURL} tableHeader={title} />
    </>
  );
}
