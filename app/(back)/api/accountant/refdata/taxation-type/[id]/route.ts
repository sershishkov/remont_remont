import { NextRequest, NextResponse } from 'next/server';
import Model__TaxationType from '@/lib/mongoose/models/accountant/refData/Model__TaxationType';
import Model__Client from '@/lib/mongoose/models/manager/refdata/Model__Client';

import { connectToDB } from '@/lib/mongoose/connectToDB';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = async (request: NextRequest, { params }: Props) => {
  const { id } = await params;
  try {
    await connectToDB();
    const one__ITEM = await Model__TaxationType.findById(id);

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
  const { taxationTypeName } = await request.json();

  if (!taxationTypeName) {
    return new NextResponse(
      JSON.stringify({
        message: 'Please add all fields',
      }),

      { status: 400 }
    );
  }

  try {
    await connectToDB();

    const new__ITEM = {
      taxationTypeName,
    };

    const updated__ITEM = await Model__TaxationType.findByIdAndUpdate(
      id,
      new__ITEM,
      {
        new: true,
        runValidators: true,
      }
    );

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

    const related__Client = await Model__Client.findOne({ taxationType: id });

    if (related__Client) {
      return new NextResponse(
        JSON.stringify({
          message: 'не возможно удалить этот елемент, есть связанные элементы',
        }),
        {
          status: 403,
        }
      );
    } else {
      const one__ITEM = await Model__TaxationType.findByIdAndDelete(id);

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
        message: 'Элемент удалён успешно',
        my_data: {},
      };

      return new NextResponse(JSON.stringify(responseObj), { status: 200 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
};
