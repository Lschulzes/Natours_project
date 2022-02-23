export default class extends Error {
  public status: string;
  constructor(message: string, public statusCode: number) {
    super(message);
    this.status = statusCode.toString().charAt(0) === '4' ? 'fail' : 'error';
  }
}
