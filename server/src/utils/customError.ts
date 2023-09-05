const customError = (
  errMsg: string,
  errStatus: number,
  errData: string | string[] = errMsg
) => {
  const error: any = new Error(errMsg);
  error.statusCode = errStatus;
  console.log(errData);
  if (errData === errMsg) {
    error.data = [errMsg];
  } else {
    // console.log(errData);
    error.data = errData;
  }
  return error;
};

export default customError;
