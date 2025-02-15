import { NextRequest, NextResponse } from 'next/server';
import Model__CashRegister from '@/lib/mongoose/models/accountant/refData/Model__CashRegister';

import Model__Worker from '@/lib/mongoose/models/accountant/refData/Model__Worker';

import { connectToDB } from '@/lib/mongoose/connectToDB';

export const POST = async (request: NextRequest) => {
  const { cashRegisterName, allowedWorkers } = await request.json();
  if (!cashRegisterName || allowedWorkers.length === 0) {
    return new NextResponse(
      JSON.stringify({
        message: 'Please add all fields',
      }),
      { status: 400 }
    );
  }

  try {
    await connectToDB();
    // Check if already exists
    const already__Exists = await Model__CashRegister.findOne({
      cashRegisterName,
    });

    if (already__Exists) {
      return new NextResponse(
        JSON.stringify({
          message: 'This item already exists',
        }),
        {
          status: 400,
        }
      );
    }
    const new__ITEM = await Model__CashRegister.create({
      cashRegisterName,
      allowedWorkers,
    });

    const responseObj = {
      message: 'Добавлено успешно',
      my_data: new__ITEM,
    };

    return new NextResponse(JSON.stringify(responseObj), { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
};

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') ?? '0');
  const pageSize = parseInt(url.searchParams.get('limit') ?? '0');
  const filterSTR = url.searchParams.get('filter') ?? '';
  const skip = (page - 1) * pageSize;
  let filterObject = {};

  if (filterSTR) {
    const myRegex = { $regex: filterSTR, $options: 'i' };

    filterObject = {
      $or: [{ cashRegisterName: myRegex }],
    };
  }

  try {
    await connectToDB();

    const total: number = await Model__CashRegister.countDocuments({});
    const totalPages: number =
      pageSize === 0 ? total : Math.ceil(total / pageSize);

    const all__ITEMS = await Model__CashRegister.find(filterObject)
      .limit(pageSize)
      .skip(skip)
      .sort({
        cashRegisterName: -1,
      })
      .populate({
        path: 'allowedWorkers',
        model: Model__Worker,
        select: 'lastName firstName',
      });

    if (!all__ITEMS) {
      return new NextResponse(
        JSON.stringify({
          message: 'На данный момент ничего в базе нет',
        }),

        {
          status: 400,
        }
      );
    }
    const responseObj = {
      message: 'Найдено успешно',
      my_data: {
        items: all__ITEMS,
        total,
        totalPages,
      },
    };
    return new NextResponse(JSON.stringify(responseObj), { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
};
