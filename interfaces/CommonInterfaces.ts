export interface MyRequestParams {
  page?: string;
  limit?: string;
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  filter?: Object;
}

export interface paramsProps {
  params: {
    id: string;
  };
}
