import { RawgApi } from 'src/rawg/api/rawg-api';

export class GetListGames extends RawgApi {
  public constructor(private params: { search: string; page?: number; pageSize?: number }) {
    super();
  }

  protected getEndpoint(): string {
    return `/games?search=${this.params.search}&page=${this.params.page ?? 1}&page_size=${this.params.pageSize ?? 50}&search_precise=1`;
  }

  protected getMethod(): string {
    return this.METHOD_GET;
  }
}
