'use client';
import React, { useState, useLayoutEffect } from 'react';
import { ParamsProps } from '@/interfaces/CommonInterfaces';
import { I_Contract, I_Client } from '@/interfaces/refdata';
import { item__get_one } from '@/lib/actions/refdata.actions';

import JkhProectnAvtAktToPrint from '@/components/documents/formsToPrint/jkh-proectn-avtorsk/JkhProectnAvtAktToPrint';

export default function ProjectAndAvtoskAktPrint({
  params,
}: Readonly<ParamsProps>) {
  const { id } = React.use(params);
  const [currentContract, setCurrentContract] = useState<I_Contract>();
  const [currentClient, setCurrentClient] = useState<I_Client>();

  useLayoutEffect(() => {
    if (id) {
      const myGetOne = async () => {
        const localContract = await item__get_one(
          { _id: id },
          '/manager/refdata/contract'
        );
        const localClient = await item__get_one(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          { _id: localContract?.client._id },
          '/manager/refdata/client'
        );

        setCurrentContract(localContract);
        setCurrentClient(localClient);
      };
      myGetOne();
    }
  }, [id]);
  return (
    <JkhProectnAvtAktToPrint
      currentContract={currentContract!}
      currentClient={currentClient!}
    />
  );
}
