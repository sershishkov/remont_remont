import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/(back)/api/auth/[...nextauth]/options';
import Model__NakladnayaRems from '@/lib/mongoose/models/manager/documents/Model__NakladnayaRems';

import Model__Contract from '@/lib/mongoose/models/manager/refdata/Model__Contract';
import Model__Client from '@/lib/mongoose/models/manager/refdata/Model__Client';

import Model__Product from '@/lib/mongoose/models/manager/refdata/Model__Product';
import Model__Unit from '@/lib/mongoose/models/manager/refdata/Model__Unit';
import Model__FirmType from '@/lib/mongoose/models/accountant/refData/Model__FirmType';
import Model__TaxationType from '@/lib/mongoose/models/accountant/refData/Model__TaxationType';

import { connectToDB } from '@/lib/mongoose/connectToDB';

import { accountant_role } from '@/constants/constants';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = async (request: NextRequest, { params }: Props) => {
  const { id } = await params;
  try {
    await connectToDB();
    const one__ITEM = await Model__NakladnayaRems.findById(id)
      .populate({
        path: 'contract',
        model: Model__Contract,
        // select: 'contractNumber contractDescription',
        populate: [
          {
            path: 'ourFirm',
            model: Model__Client,
            // select: 'clientShortName',
            populate: [
              {
                path: 'firmType',
                model: Model__FirmType,
                select: 'firmTypeShortName',
              },
            ],
          },
          {
            path: 'client',
            model: Model__Client,
            // select: 'clientShortName',
            populate: [
              {
                path: 'firmType',
                model: Model__FirmType,
                select: 'firmTypeShortName',
              },
            ],
          },
        ],
      })
      .populate({
        path: 'products.product',
        model: Model__Product,
        select: 'productName',
        populate: [
          {
            path: 'unit',
            model: Model__Unit,
            select: 'unitName',
          },
        ],
      })
      .populate({
        path: 'executorFirm1',
        model: Model__Client,
        populate: [
          {
            path: 'firmType',
            model: Model__FirmType,
            select: 'firmTypeShortName',
          },
          {
            path: 'taxationType',
            model: Model__TaxationType,
            select: 'taxationTypeName',
          },
        ],
      })
      .populate({
        path: 'executorFirm2',
        model: Model__Client,
        populate: [
          {
            path: 'firmType',
            model: Model__FirmType,
            select: 'firmTypeShortName',
          },
          {
            path: 'taxationType',
            model: Model__TaxationType,
            select: 'taxationTypeName',
          },
        ],
      })
      .populate({
        path: 'executorFirm3',
        model: Model__Client,
        populate: [
          {
            path: 'firmType',
            model: Model__FirmType,
            select: 'firmTypeShortName',
          },
          {
            path: 'taxationType',
            model: Model__TaxationType,
            select: 'taxationTypeName',
          },
        ],
      })
      .populate({
        path: 'clientFirm',
        model: Model__Client,
        populate: [
          {
            path: 'firmType',
            model: Model__FirmType,
            select: 'firmTypeShortName',
          },
        ],
      })
      .populate({
        path: 'ourFirm',
        model: Model__Client,
        populate: [
          {
            path: 'firmType',
            model: Model__FirmType,
            select: 'firmTypeShortName',
          },
        ],
      });

    if (!one__ITEM) {
      return new NextResponse(
        JSON.stringify({
          message: 'Нет  объекта с данным id',
        }),
        {
          status: 400,
        }
      );
    }
    const responseObj = {
      message: 'Элемент найден успешно',
      my_data: one__ITEM,
    };

    return new NextResponse(JSON.stringify(responseObj), { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
};

export const PUT = async (request: NextRequest, { params }: Props) => {
  const { id } = await params;
  const myData = await request.json();

  if (!myData) {
    return new NextResponse(
      JSON.stringify({
        message: 'Please add all fields',
      }),

      { status: 400 }
    );
  }
  const {
    nakladnayaRemsNumber1,
    nakladnayaRemsNumber2,
    nakladnayaRemsNumber3,

    nakladnayaRemsDate,
    contract,

    executorFirm1,
    executorFirm2,
    executorFirm3,
    clientFirm,
    ourFirm,

    percent2,
    percent3,
    totalRemsNaklSumToShow,

    products,
  } = myData;

  try {
    await connectToDB();

    const new__ITEM = {
      nakladnayaRemsNumber1,
      nakladnayaRemsNumber2,
      nakladnayaRemsNumber3,

      nakladnayaRemsDate,
      contract,

      executorFirm1,
      executorFirm2,
      executorFirm3,
      clientFirm,
      ourFirm,

      percent2,
      percent3,
      totalRemsNaklSumToShow,

      products,
    };

    const updated__ITEM = await Model__NakladnayaRems.findByIdAndUpdate(
      id,
      new__ITEM,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated__ITEM) {
      return new NextResponse(
        JSON.stringify({
          message: 'Не удалось обновить накладную',
        }),
        {
          status: 400,
        }
      );
    }

    const responseObj = {
      message: 'Элемент изменен успешно',
      my_data: updated__ITEM,
    };

    return new NextResponse(JSON.stringify(responseObj), { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest, { params }: Props) => {
  const { id } = await params;
  try {
    await connectToDB();

    const one__ITEM = await Model__NakladnayaRems.findById(id);

    if (!one__ITEM) {
      return new NextResponse(
        JSON.stringify({
          message: 'Нет  объекта с данным id',
        }),
        {
          status: 400,
        }
      );
    }
    const session = await getServerSession(authOptions);
    const currentRole = session?.user.role;

    if (!accountant_role.includes(currentRole!)) {
      return new NextResponse(
        JSON.stringify({
          message: 'У Вас нет прав для удаления',
        }),
        {
          status: 403,
        }
      );
    } else {
      await Model__NakladnayaRems.findByIdAndDelete(id);
    }

    const responseObj = {
      message: 'Элемент удалён успешно',
      my_data: {},
    };

    return new NextResponse(JSON.stringify(responseObj), { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
};
