import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from 'src/games/games.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RawgService } from 'src/rawg/rawg.service';

const mockPrismaService = {
  game: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    createMany: jest.fn(),
  },
};

const mockRawgService = {
  getListGames: jest.fn(),
};

describe('GamesService', () => {
  let service: GamesService;
  let prismaService: PrismaService;
  let rawgService: RawgService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RawgService, useValue: mockRawgService },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    prismaService = module.get<PrismaService>(PrismaService);
    rawgService = module.get<RawgService>(RawgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should return games from database when they exist', async () => {
      const gamesFromDB = [
        {
          id: 'uuid-1',
          externalId: '1',
          title: 'Test Game',
          description: 'Test Description',
          platforms: ['PS5', 'PC'],
          releaseDate: '2023-01-01',
          rating: 4.5,
          coverImage: 'image.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.game.findMany.mockResolvedValueOnce(gamesFromDB);

      const result = await service.search({ title: 'Test Game' });

      expect(result).toEqual(gamesFromDB);
      expect(mockPrismaService.game.findMany).toHaveBeenCalledWith({
        where: {
          title: {
            contains: 'Test Game',
          },
        },
      });
      expect(mockRawgService.getListGames).not.toHaveBeenCalled();
      expect(mockPrismaService.game.createMany).not.toHaveBeenCalled();
    });

    it('should fetch games from RAWG API and save to database when not found locally', async () => {
      mockPrismaService.game.findMany.mockResolvedValueOnce([]);

      const rawgGames = [
        {
          id: 1,
          slug: 'game-1',
          name: 'Test Game',
          background_image: 'image.jpg',
          rating: 4.5,
          released: '2023-01-01',
          platforms: [{ platform: { id: 1, slug: 'pc', name: 'PC' } }],
        },
      ];

      const prismaGames = [
        {
          externalId: '1',
          title: 'Test Game',
          description: 'Test Game',
          platforms: ['PC'],
          releaseDate: '2023-01-01',
          rating: 4.5,
          coverImage: 'image.jpg',
        },
      ];

      const savedGames = [
        {
          id: 'uuid-1',
          externalId: '1',
          title: 'Test Game',
          description: 'Test Game',
          platforms: ['PC'],
          releaseDate: '2023-01-01',
          rating: 4.5,
          coverImage: 'image.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRawgService.getListGames.mockResolvedValueOnce(rawgGames);
      mockPrismaService.game.createMany.mockResolvedValueOnce({ count: 1 });
      mockPrismaService.game.findMany.mockResolvedValueOnce(savedGames);

      const result = await service.search({ title: 'Test Game' });

      expect(mockRawgService.getListGames).toHaveBeenCalledWith({ search: 'Test Game' });
      expect(mockPrismaService.game.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            externalId: '1',
            title: 'Test Game',
          }),
        ]),
      });
      expect(result).toEqual(savedGames);
    });

    it('should return empty array when no games are found locally or from RAWG', async () => {
      mockPrismaService.game.findMany.mockResolvedValueOnce([]);
      mockRawgService.getListGames.mockResolvedValueOnce([]);
      mockPrismaService.game.createMany.mockResolvedValueOnce({ count: 0 });
      mockPrismaService.game.findMany.mockResolvedValueOnce([]);

      const result = await service.search({ title: 'NonExistentGame' });

      expect(result).toEqual([]);
      expect(mockRawgService.getListGames).toHaveBeenCalledWith({ search: 'NonExistentGame' });
      expect(mockPrismaService.game.createMany).toHaveBeenCalledWith({ data: [] });
    });
  });

  describe('getAll', () => {
    it('should return all games from database', async () => {
      const mockGames = [
        {
          id: 'uuid-1',
          externalId: '1',
          title: 'Game 1',
          description: 'Description 1',
          platforms: ['PS5'],
          releaseDate: '2023-01-01',
          rating: 4.5,
          coverImage: 'image1.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'uuid-2',
          externalId: '2',
          title: 'Game 2',
          description: 'Description 2',
          platforms: ['PC', 'Xbox'],
          releaseDate: '2023-02-01',
          rating: 4.2,
          coverImage: 'image2.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.game.findMany.mockReset();
      mockPrismaService.game.findMany.mockResolvedValue(mockGames);

      const result = await service.getAll();

      expect(result).toEqual(mockGames);
      expect(mockPrismaService.game.findMany).toHaveBeenCalledWith();
    });
  });

  describe('findById', () => {
    it('should return a game by id when it exists', async () => {
      const mockGame = {
        id: 'uuid-1',
        externalId: '1',
        title: 'Game 1',
        description: 'Description 1',
        platforms: ['PS5'],
        releaseDate: '2023-01-01',
        rating: 4.5,
        coverImage: 'image1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.game.findUnique.mockResolvedValueOnce(mockGame);

      const result = await service.findById({ id: 'uuid-1' });

      expect(result).toEqual(mockGame);
      expect(mockPrismaService.game.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'uuid-1',
        },
      });
    });

    it('should return null when game does not exist', async () => {
      mockPrismaService.game.findUnique.mockResolvedValueOnce(null);

      const result = await service.findById({ id: 'non-existent-id' });

      expect(result).toBeNull();
      expect(mockPrismaService.game.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'non-existent-id',
        },
      });
    });
  });

  describe('getGamesFromRawg', () => {
    it('should transform RAWG API results to Prisma format', async () => {
      const rawgGames = [
        {
          id: 1,
          slug: 'game-1',
          name: 'Test Game',
          background_image: 'image.jpg',
          rating: 4.5,
          released: '2023-01-01',
          platforms: [
            { platform: { id: 1, slug: 'pc', name: 'PC' } },
            { platform: { id: 2, slug: 'ps5', name: 'PlayStation 5' } },
          ],
        },
      ];

      mockRawgService.getListGames.mockResolvedValueOnce(rawgGames);

      const getGamesFromRawgMethod = (service as any).getGamesFromRawg.bind(service);
      const result = await getGamesFromRawgMethod('Test Game');

      expect(mockRawgService.getListGames).toHaveBeenCalledWith({ search: 'Test Game' });
      expect(result).toEqual([
        {
          externalId: '1',
          title: 'Test Game',
          description: 'Test Game',
          platforms: ['PC', 'PlayStation 5'],
          releaseDate: '2023-01-01',
          rating: 4.5,
          coverImage: 'image.jpg',
        },
      ]);
    });

    it('should handle empty results from RAWG API', async () => {
      mockRawgService.getListGames.mockResolvedValueOnce([]);

      const getGamesFromRawgMethod = (service as any).getGamesFromRawg.bind(service);
      const result = await getGamesFromRawgMethod('NonExistentGame');

      expect(mockRawgService.getListGames).toHaveBeenCalledWith({ search: 'NonExistentGame' });
      expect(result).toEqual([]);
    });
  });
});
