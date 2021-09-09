export class Success<DataType> {
  constructor(data: DataType) {
    this.data = data;
  }

  data: DataType;
}

export class Failure {
  constructor(error: Error) {
    this.error = error;
  }

  error: Error;
}
