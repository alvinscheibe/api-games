import { AxiosInstance, AxiosResponse } from "axios";
import { rawgAxiosClient } from "src/rawg/api/rawg-axios-client";

export abstract class RawgApi {
  public METHOD_GET = 'GET';
  public METHOD_POST = 'POST';

  private client: AxiosInstance;
  private response: AxiosResponse;

  protected abstract getEndpoint(): string;
  protected abstract getMethod(): string;
  protected getBody(): any {}

  constructor() {
    this.client = rawgAxiosClient;
  }

  public async send(): Promise<RawgApi> {
    switch (this.getMethod()) {
      case this.METHOD_GET:
        this.response = await this.client.get(this.getEndpoint());
        break;
      case this.METHOD_POST:
        this.response = await this.client.post(this.getEndpoint(), this.getBody());
        break;
    }

    return this;
  }

  public getResponse<T>(): AxiosResponse<T> {
    return this.response;
  }
}
