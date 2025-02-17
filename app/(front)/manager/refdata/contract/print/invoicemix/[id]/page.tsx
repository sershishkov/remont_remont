'use client';
import React, { useState, useEffect } from 'react';
import { item__get_one, get__all } from '@/lib/actions/refdata.actions';
import { ParamsProps } from '@/interfaces/CommonInterfaces';
import InviceMixToPrint from '@/components/documents/formsToPrint/InviceMixToPrint';
import {
  I_Contract,
  I_Client,
  I_ThirdPartyServiceInAkt,
  I_ServiceWorkInAkt,
  I_WorkRows,
  I_LProduct,
  I_ProductInNakl,
  I_DocumentNakladnaya,
  I_DocumentAktOfWork,
} from '@/interfaces/refdata';

import { arr__TypeOfOSBB } from '@/constants/constants';
const currentURL = '/manager/refdata/contract';

const initState = {
  invoiceNumber: '',
  invoiceDate: new Date(),
  naklSum: 0,
  aktSum: 0,
  totalInvoiceSum: 0,
  invoiceDescription: '',
};

export default function InvoiceMix({ params }: Readonly<ParamsProps>) {
  const { id } = React.use(params);
  const [formData, setFormData] = useState(initState);
  const [tableAktRows, setTableAktRows] = useState<I_WorkRows[]>([]);
  const [tableNaklRows, setTableNaklRows] = useState<I_LProduct[]>([]);
  const [localOurFirmObj, setLocalOurFirmObj] = useState<I_Client>();
  const [localClientObj, setLocalClientObj] = useState<I_Client>();
  const [localContractObj, setLocalContractObj] = useState<I_Contract>();
  const {
    invoiceNumber,
    invoiceDate,
    naklSum,
    aktSum,
    totalInvoiceSum,
    invoiceDescription,
  } = formData;

  useEffect(() => {
    if (id) {
      const myGetOne = async () => {
        const currentContract: I_Contract = await item__get_one(
          { _id: id },
          currentURL
        );

        const currentOurFirm: I_Client = await item__get_one(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          { _id: currentContract.ourFirm._id },
          '/manager/refdata/client'
        );

        const currentClient: I_Client = await item__get_one(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          { _id: currentContract.client._id },
          '/manager/refdata/client'
        );
        const localArrOfRelNakl = await get__all(
          {
            page: '0',
            limit: '0',
            filter: '',
            contract: currentContract._id,
          },
          `/manager/documents/nakladnaya`
        );
        const localArrOfRelAkt = await get__all(
          {
            page: '0',
            limit: '0',
            filter: '',
            contract: currentContract._id,
          },
          `/manager/documents/akt-of-work`
        );
        const localContactType =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          currentContract?.contractType?.contractTypeName;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const firmType = currentContract?.client?.firmType?.firmTypeShortName;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const contractType = currentContract?.contractType?.contractTypeName;
        let contractDescription = '';

        if (
          contractType === 'Общий' ||
          contractType === 'Общий Сумма' ||
          contractType === 'Предоплата Частичная' ||
          contractType === 'Предоплата Материал' ||
          contractType === 'Предоплата 100%' ||
          contractType === 'Кошторис Сумма' ||
          contractType === 'Кошторис Частичная Предоплата' ||
          contractType === 'Кошторис Предоплата Материал' ||
          contractType === 'Кошторис Предоплата 100%'
        ) {
          const injectPhrase = arr__TypeOfOSBB.includes(firmType)
            ? 'у житловому будинку за адресою: '
            : ' за адресою:';
          const workAddress = currentContract?.workAddress;
          contractDescription = `${currentContract?.contractDescription} ${injectPhrase} ${workAddress}`;
        } else {
          contractDescription = currentContract.contractDescription!;
        }

        const currentNakl: I_DocumentNakladnaya = localArrOfRelNakl?.items[0];
        const currentAkt: I_DocumentAktOfWork = localArrOfRelAkt?.items[0];
        setLocalOurFirmObj(currentOurFirm);
        setLocalClientObj(currentClient);
        setLocalContractObj(currentContract);

        const tempNaklSum = currentNakl?.totalNaklSum
          ? Number(currentNakl?.totalNaklSum)
          : 0;

        const tempAktSum = currentAkt?.totalSums?.totalAktSum
          ? Number(currentAkt?.totalSums?.totalAktSum)
          : 0;

        const tempTotalInvoiceSum = tempNaklSum + tempAktSum;

        setFormData((prevState) => ({
          ...prevState,
          invoiceNumber: currentContract.invoiceNumberBase,
          invoiceDate: new Date(currentContract.contractDate!),
          naklSum: tempNaklSum,
          aktSum: tempAktSum,
          totalInvoiceSum: tempTotalInvoiceSum,
          invoiceDescription: contractDescription,
        }));

        if (
          localContactType === 'Кошторис Сумма' ||
          localContactType === 'Кошторис Частичная Предоплата' ||
          localContactType === 'Кошторис Предоплата Материал' ||
          localContactType === 'Кошторис Предоплата 100%'
        ) {
          let allThirdString = '';
          let allServString = '';
          currentAkt.thirdPartyServices?.forEach(
            (inner_item: I_ThirdPartyServiceInAkt) => {
              allThirdString += `${
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                inner_item.thirdPartyService.thirdPartyServiceName!
              } ${inner_item.extraInformation!}, `;
            }
          );
          currentAkt.serviceWorks?.forEach((inner_item: I_ServiceWorkInAkt) => {
            allServString += `${
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              inner_item.serviceWork.serviceWorkName!
            } ${inner_item.extraInformation!}, `;
          });

          const sumToShow = tempNaklSum + tempAktSum;

          const newRow = {
            row_id: 'row_id',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            workName: `${contractDescription} (${allThirdString} ${allServString})`,
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
            aktSum: tempTotalInvoiceSum,
          }));

          setTableAktRows([newRow]);
          setTableNaklRows([]);
        } else if (localContactType === 'Ремсервис (поточный)') {
          const sumToShow = tempNaklSum + tempAktSum;

          const newRow = {
            row_id: 'row_id',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            workName: contractDescription,
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
            aktSum: tempTotalInvoiceSum,
          }));

          setTableAktRows([newRow]);
          setTableNaklRows([]);
        } else {
          const arrToSetRowsThird = currentAkt?.thirdPartyServices?.map(
            (inner_item: I_ThirdPartyServiceInAkt) => {
              return {
                row_id: inner_item._id!.toString(),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                workName:
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
          const arrToSetRowsServ = currentAkt?.serviceWorks?.map(
            (inner_item: I_ServiceWorkInAkt) => {
              return {
                row_id: inner_item._id!.toString(),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                workName:
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
          setTableAktRows([...arrToSetRowsThird, ...arrToSetRowsServ]);

          const arrToSetRows = currentNakl?.products?.map(
            (inner_item: I_ProductInNakl) => {
              return {
                row_id: inner_item._id!.toString(),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                product: inner_item.product.productName,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                unit: inner_item.product.unit.unitName,
                extraInformation: inner_item.extraInformation!,
                amount: inner_item?.amount.toString(),
                price: inner_item?.price.toFixed(2),
                rowSum: (inner_item?.amount * inner_item?.price).toFixed(2),
              };
            }
          );

          setTableNaklRows(arrToSetRows);
        }
      };

      myGetOne();
    }
  }, [id]);

  return (
    <InviceMixToPrint
      tableAktRows={tableAktRows}
      tableNaklRows={tableNaklRows}
      localOurFirmObj={localOurFirmObj!}
      localClientObj={localClientObj!}
      localContractObj={localContractObj!}
      invoiceNumber={invoiceNumber}
      invoiceDate={invoiceDate}
      naklSum={naklSum}
      aktSum={aktSum}
      totalInvoiceSum={totalInvoiceSum}
      invoiceDescription={invoiceDescription}
    />
  );
}
