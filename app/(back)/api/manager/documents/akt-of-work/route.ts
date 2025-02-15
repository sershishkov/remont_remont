import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/(back)/api/auth/[...nextauth]/options';

import Model__DocumentAkt from '@/lib/mongoose/models/manager/documents/Model__DocumentAkt';

import Model__Contract from '@/lib/mongoose/models/manager/refdata/Model__Contract';
import Model__Client from '@/lib/mongoose/models/manager/refdata/Model__Client';
import Model__ThirdPartyService from '@/lib/mongoose/models/manager/refdata/Model__ThirdPartyService';
import Model__ServiceWork from '@/lib/mongoose/models/manager/refdata/Model__ServiceWork';

import Model__Unit from '@/lib/mongoose/models/manager/refdata/Model__Unit';

import { connectToDB } from '@/lib/mongoose/connectToDB';

export const POST = async (request: NextRequest) => {
  const {
    aktOfWorkNumber,
    aktOfWorkDate,
    contract,

    thirdPartyServices,
    serviceWorks,

    isActive,

    typeAkt,

    aktOurFirm,
    aktClient,
  } = await request.json();

  if (
    !aktOfWorkNumber ||
    !contract ||
    (thirdPartyServices &&
      thirdPartyServices.length === 0 &&
      serviceWorks &&
      serviceWorks.length === 0)
  ) {
    return new NextResponse(
      JSON.stringify({
        message: 'Please add all fields ',
      }),
      { status: 400 }
    );
  }

  try {
    await connectToDB();

    // Check if already exists
    const already__Exists = await Model__DocumentAkt.findOne({
      aktOfWorkNumber,
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
    const session = await getServerSession(authOptions);

    const new__ITEM = await Model__DocumentAkt.create({
      aktOfWorkNumber,
      aktOfWorkDate,
      contract,

      thirdPartyServices,
      serviceWorks,

      isActive,

      typeAkt,
      creator: session?.user._id,

      aktOurFirm,
      aktClient,
    });

    if (!new__ITEM) {
      return new NextResponse(
        JSON.stringify({
          message: 'Не удалось создать акт',
        }),
        {
          status: 400,
        }
      );
    }

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
  const skip = (page - 1) * pageSize;

  const filterSTR = url.searchParams.get('filter') ?? '';

  const contract = url.searchParams.get('contract') ?? '';
  const aktOurFirm = url.searchParams.get('aktOurFirm') ?? '';
  const aktClient = url.searchParams.get('aktClient') ?? '';
  const aktDateStart = url.searchParams.get('aktDateStart') ?? '';
  const aktDateEnd = url.searchParams.get('aktDateEnd') ?? '';

  let filterObject = {};
  const andArr = [];

  if (filterSTR) {
    const myRegex = { $regex: filterSTR, $options: 'i' };

    const orObject = {
      $or: [
        {
          aktOfWorkNumber: myRegex,
        },
      ],
    };

    andArr.push(orObject);
  }

  if (contract) {
    andArr.push({ contract: contract });
  }
  if (aktOurFirm) {
    andArr.push({ aktOurFirm: aktOurFirm });
  }
  if (aktClient) {
    andArr.push({ aktClient: aktClient });
  }

  if (aktDateStart && aktDateEnd) {
    andArr.push({
      aktOfWorkDate: {
        $gte: new Date(aktDateStart),
        $lte: new Date(aktDateEnd),
      },
    });
  }

  if (andArr.length > 0) {
    filterObject = {
      $and: andArr,
    };
  }

  try {
    await connectToDB();

    const total: number = await Model__DocumentAkt.countDocuments({});
    const totalPages: number =
      pageSize === 0 ? total : Math.ceil(total / pageSize);

    const all__ITEMS = await Model__DocumentAkt.find(filterObject)

      .limit(pageSize)
      .skip(skip)
      .sort({
        aktOfWorkNumber: -1,
      })
      .populate({
        path: 'contract',
        model: Model__Contract,
        select: 'contractNumber contractDescription',
        populate: [
          {
            path: 'ourFirm',
            model: Model__Client,
            select: 'clientShortName',
          },
          {
            path: 'client',
            model: Model__Client,
            select: 'clientShortName',
          },
        ],
      })
      .populate({
        path: 'thirdPartyServices.thirdPartyService',
        model: Model__ThirdPartyService,
        select: 'thirdPartyServiceName',
        populate: [
          {
            path: 'unit',
            model: Model__Unit,
            select: 'unitName',
          },
        ],
      })
      .populate({
        path: 'serviceWorks.serviceWork',
        model: Model__ServiceWork,
        select: 'serviceWorkName',
        populate: [
          {
            path: 'unit',
            model: Model__Unit,
            select: 'unitName',
          },
        ],
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
