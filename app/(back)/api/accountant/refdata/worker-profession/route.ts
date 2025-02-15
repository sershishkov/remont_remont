import { NextRequest, NextResponse } from 'next/server';
import Model__WorkerProfession from '@/lib/mongoose/models/accountant/refData/Model__WorkerProfession';

import { connectToDB } from '@/lib/mongoose/connectToDB';

export const POST = async (request: NextRequest) => {
  const { workerProfessionName, description } = await request.json();
  if (!workerProfessionName || !description) {
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
    const already__Exists = await Model__WorkerProfession.findOne({
      workerProfessionName,
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
    const new__ITEM = await Model__WorkerProfession.create({
      workerProfessionName,
      description,
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
      $or: [{ workerProfessionName: myRegex }, { description: myRegex }],
    };
  }

  try {
    await connectToDB();

    const total: number = await Model__WorkerProfession.countDocuments({});
    const totalPages: number =
      pageSize === 0 ? total : Math.ceil(total / pageSize);

    const all__ITEMS = await Model__WorkerProfession.find(filterObject)
      .limit(pageSize)
      .skip(skip)
      .sort({
        workerProfessionName: 1,
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
