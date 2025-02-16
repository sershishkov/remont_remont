'use client';
import React, { useState, useEffect } from 'react';

import { item__get_one, get__all } from '@/lib/actions/refdata.actions';
import InvoiceToPrint from '@/components/documents/formsToPrint/InvoiceToPrint';
import { paramsProps } from '@/interfaces/CommonInterfaces';
import {
  I_Contract,
  I_Client,
  I_ThirdPartyServiceInAkt,
  I_ServiceWorkInAkt,
  I_WorkRows,
  I_LProduct,
  I_DocumentNakladnaya,
} from '@/interfaces/refdata';
import { arr__TypeOfOSBB } from '@/constants/constants';

const currentURL = '/manager/documents/akt-of-work';
const initState = {
  invoiceNumber: '',
  invoiceDate: new Date(),
  typeAkt: '',
  aktSum: 0,
};

export default function InvoiceAktPrint({ params }: Readonly<paramsProps>) {
  const { id } = params;
  const [formData, setFormData] = useState(initState);
  const [tableRows, setTableRows] = useState<I_WorkRows[] | I_LProduct[]>([]);

  const [localOurFirmObj, setLocalOurFirmObj] = useState<I_Client>();
  const [localClientObj, setLocalClientObj] = useState<I_Client>();
  const [localContractObj, setLocalContractObj] = useState<I_Contract>();

  const { invoiceNumber, invoiceDate, typeAkt, aktSum } = formData;

  useEffect(() => {
    if (id) {
      const myGetOne = async () => {
        const item = await item__get_one({ _id: id }, currentURL);
        if (item) {
          const currentContract = await item__get_one(
            { _id: item.contract._id },
            '/manager/refdata/contract'
          );

          const currentOurFirm = await item__get_one(
            { _id: item.aktOurFirm },
            '/manager/refdata/client'
          );

          const currentClient = await item__get_one(
            { _id: item.aktClient },
            '/manager/refdata/client'
          );

          const localContactType =
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            currentContract?.contractType?.contractTypeName;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          const firmType = currentContract?.client?.firmType?.firmTypeShortName;

          const injectPhrase = arr__TypeOfOSBB.includes(firmType)
            ? 'у житловому будинку за адресою: '
            : ' за адресою:';
          const workAddress = currentContract?.workAddress;
          const contractDescription = `${currentContract?.contractDescription} ${injectPhrase} ${workAddress}`;

          setFormData((prevState) => ({
            ...prevState,
            invoiceNumber: currentContract.invoiceNumberAkt,
            invoiceDate: new Date(currentContract.contractDate),
            typeAkt: item.typeAkt,
            aktSum: Number(item.totalSums.totalAktSum),
          }));
          setLocalOurFirmObj(currentOurFirm);
          setLocalClientObj(currentClient);
          setLocalContractObj(currentContract);

          if (
            localContactType === 'Кошторис Сумма' ||
            localContactType === 'Кошторис Частичная Предоплата' ||
            localContactType === 'Кошторис Предоплата Материал' ||
            localContactType === 'Кошторис Предоплата 100%'
          ) {
            const localArrOfRelNakl = await get__all(
              {
                page: '0',
                limit: '0',
                filter: '',
                contract: currentContract._id,
              },
              `/manager/documents/nakladnaya`
            );

            const currentNakl: I_DocumentNakladnaya =
              localArrOfRelNakl?.items[0];

            const totalNakl = currentNakl.totalNaklSum
              ? Number(currentNakl.totalNaklSum)
              : 0;
            let allThirdString = '';
            let allServString = '';
            item.thirdPartyServices?.forEach(
              (inner_item: I_ThirdPartyServiceInAkt) => {
                allThirdString += `${
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  inner_item.thirdPartyService.thirdPartyServiceName!
                } ${inner_item.extraInformation!}, `;
              }
            );
            item.serviceWorks?.forEach((inner_item: I_ServiceWorkInAkt) => {
              allServString += `${
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                inner_item.serviceWork.serviceWorkName!
              } ${inner_item.extraInformation!}, `;
            });
            const sumToShow = Number(item.totalSums.totalAktSum) + totalNakl;

            const newRow = {
              row_id: 'row_id',
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              product: `${contractDescription} (${allThirdString} ${allServString})`,
              extraInformation: '',
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              unit: 'послуга',
              amount: '1',
              price: sumToShow.toFixed(2),
              rowSum: sumToShow.toFixed(2),
            };
            setFormData((prevState) => ({
              ...prevState,
              aktSum: sumToShow,
            }));
            setTableRows([newRow]);
          } else if (localContactType === 'Ремсервис (поточный)') {
            const sumToShow = Number(item.totalSums.totalAktSum);

            const newRow = {
              row_id: 'row_id',
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              product: contractDescription,
              extraInformation: '',
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              unit: 'послуга',
              amount: '1',
              price: sumToShow.toFixed(2),
              rowSum: sumToShow.toFixed(2),
            };

            setFormData((prevState) => ({
              ...prevState,
              aktSum: sumToShow,
            }));

            setTableRows([newRow]);
          } else {
            const arrToSetRowsThird = item.thirdPartyServices?.map(
              (inner_item: I_ThirdPartyServiceInAkt) => {
                return {
                  row_id: inner_item._id!.toString(),
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  product:
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    inner_item.thirdPartyService.thirdPartyServiceName!,
                  extraInformation: inner_item.extraInformation!,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  unit: inner_item?.thirdPartyService?.unit!.unitName,
                  amount: inner_item?.amount!.toString(),
                  price: inner_item?.price!.toFixed(2),
                  rowSum: (inner_item.amount! * inner_item.price!).toFixed(2),
                };
              }
            );
            const arrToSetRowsServ = item.serviceWorks?.map(
              (inner_item: I_ServiceWorkInAkt) => {
                return {
                  row_id: inner_item._id!.toString(),
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  product:
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    inner_item.serviceWork.serviceWorkName!,
                  extraInformation: inner_item.extraInformation!,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  unit: inner_item?.serviceWork?.unit!.unitName,
                  amount: inner_item?.amount!.toString(),
                  price: inner_item?.price!.toFixed(2),
                  rowSum: (inner_item.amount! * inner_item.price!).toFixed(2),
                };
              }
            );
            setTableRows([...arrToSetRowsThird, ...arrToSetRowsServ]);
          }
        }
      };
      myGetOne();
    }
  }, [id]);

  return (
    <InvoiceToPrint
      nakladnayaNumber={invoiceNumber}
      nakladnayaDate={invoiceDate}
      ourFirmObj={localOurFirmObj!}
      clientObj={localClientObj!}
      contractObj={localContractObj!}
      typeNakl={typeAkt}
      naklSum={aktSum}
      tableRows={tableRows}
    />
  );
}
