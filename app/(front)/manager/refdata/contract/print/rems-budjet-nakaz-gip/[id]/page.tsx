'use client';
import React, { useState, useLayoutEffect } from 'react';
import { paramsProps } from '@/interfaces/CommonInterfaces';
import { I_Contract, I_Client } from '@/interfaces/refdata';
import { item__get_one } from '@/lib/actions/refdata.actions';

import RemsBudjetNakazGipToPrint from '@/components/documents/formsToPrint/rems-budjet/RemsBudjetNakazGipToPrint';

export default function RemsBudjetNakazGipPrint({
  params,
}: Readonly<paramsProps>) {
  const { id } = params;
  const [currentContract, setCurrentContract] = useState<I_Contract>();
  const [currentExecutor, setCurrentExecutor] = useState<I_Client>();

  useLayoutEffect(() => {
    if (id) {
      const myGetOne = async () => {
        const localContract = await item__get_one(
          { _id: id },
          '/manager/refdata/contract'
        );
        const localExecutor = await item__get_one(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          { _id: localContract?.ourFirm._id },
          '/manager/refdata/client'
        );

        setCurrentContract(localContract);
        setCurrentExecutor(localExecutor);
      };
      myGetOne();
    }
  }, [id]);

  return (
    <RemsBudjetNakazGipToPrint
      currentContract={currentContract!}
      currentExecutor={currentExecutor!}
    />
  );
}
