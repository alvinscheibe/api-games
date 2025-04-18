import { Test, TestingModule } from '@nestjs/testing';
import { RawgService } from './rawg.service';
import { GetListGames } from './api/get-list-games';

jest.mock('./api/get-list-games', () => {
  return {
    GetListGames: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn().mockResolvedValue({
          getResponse: jest.fn().mockImplementation(() => {
            return {
              data: {
                count: 0,
                next: null,
                previous: null,
                results: [],
              },
            };
          }),
        }),
      };
    }),
  };
});

describe('RawgService', () => {
  let service: RawgService;
  let getListGamesMock: jest.Mock;

  beforeEach(async () => {
    jest.clearAllMocks();

    getListGamesMock = GetListGames as unknown as jest.Mock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [RawgService],
    }).compile();

    service = module.get<RawgService>(RawgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListGames', () => {
    it('should fetch games from a single page when next is null', async () => {
      const mockResults = [
        {
          id: 1,
          slug: 'game-1',
          name: 'Game 1',
          background_image: 'image1.jpg',
          rating: 4.5,
          released: '2023-01-01',
          platforms: [{ platform: { id: 1, slug: 'pc', name: 'PC' } }],
        },
      ];

      getListGamesMock.mockImplementation(() => {
        return {
          send: jest.fn().mockResolvedValue({
            getResponse: jest.fn().mockReturnValue({
              data: {
                count: 1,
                next: null,
                previous: null,
                results: mockResults,
              },
            }),
          }),
        };
      });

      const result = await service.getListGames({ search: 'test' });

      expect(result).toEqual(mockResults);

      expect(getListGamesMock).toHaveBeenCalledWith({ search: 'test', page: 1 });
      expect(getListGamesMock).toHaveBeenCalledTimes(1);
    });

    it('should fetch games from multiple pages when next is provided', async () => {
      const page1Results = [
        {
          id: 1,
          slug: 'game-1',
          name: 'Game 1',
          background_image: 'image1.jpg',
          rating: 4.5,
          released: '2023-01-01',
          platforms: [{ platform: { id: 1, slug: 'pc', name: 'PC' } }],
        },
      ];

      const page2Results = [
        {
          id: 2,
          slug: 'game-2',
          name: 'Game 2',
          background_image: 'image2.jpg',
          rating: 4.2,
          released: '2023-02-01',
          platforms: [{ platform: { id: 1, slug: 'pc', name: 'PC' } }],
        },
      ];

      getListGamesMock.mockImplementationOnce(() => {
        return {
          send: jest.fn().mockResolvedValue({
            getResponse: jest.fn().mockReturnValue({
              data: {
                count: 2,
                next: 'https://api.rawg.io/api/games?page=2',
                previous: null,
                results: page1Results,
              },
            }),
          }),
        };
      });

      getListGamesMock.mockImplementationOnce(() => {
        return {
          send: jest.fn().mockResolvedValue({
            getResponse: jest.fn().mockReturnValue({
              data: {
                count: 2,
                next: null,
                previous: 'https://api.rawg.io/api/games?page=1',
                results: page2Results,
              },
            }),
          }),
        };
      });

      const result = await service.getListGames({ search: 'test' });

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(page1Results[0]);
      expect(result).toContainEqual(page2Results[0]);
      expect(getListGamesMock).toHaveBeenCalledTimes(2);
      expect(getListGamesMock).toHaveBeenNthCalledWith(1, { search: 'test', page: 1 });
      expect(getListGamesMock).toHaveBeenNthCalledWith(2, { search: 'test', page: 2 });
    });
  });

  describe('getGames (private method)', () => {
    it('should call GetListGames correctly with search and page parameters', async () => {
      const mockResponse = {
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              id: 1,
              slug: 'game-1',
              name: 'Game 1',
              background_image: 'image1.jpg',
              rating: 4.5,
              released: '2023-01-01',
              platforms: [{ platform: { id: 1, slug: 'pc', name: 'PC' } }],
            },
          ],
        },
      };

      const mockSend = jest.fn().mockResolvedValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      });

      getListGamesMock.mockImplementation(() => {
        return {
          send: mockSend,
        };
      });

      const getGamesMethod = (service as any).getGames.bind(service);
      const result = await getGamesMethod({ search: 'test', page: 2 });

      expect(getListGamesMock).toHaveBeenCalledWith({ search: 'test', page: 2 });
      expect(mockSend).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });
});
