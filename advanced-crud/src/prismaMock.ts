import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
import { jest } from '@jest/globals'

import prisma from './prisma'

// jest.mock('./prisma', () => ({
//   __esModule: true,
//   default: mockDeep<PrismaClient>(),
// }))

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>; 

// beforeEach(() => {
//   mockReset(prismaMock)
// })