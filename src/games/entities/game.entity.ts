import{ Prisma } from '@prisma/client';

export class Game implements Prisma.GameUncheckedCreateInput {
    id?: string | undefined;
    externalId: string;
    title: string;
    description: string;
    platforms?: Prisma.GameCreateplatformsInput | string[] | undefined;
    releaseDate: string;
    rating: number;
    coverImage: string;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
}
