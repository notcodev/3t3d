import { PossiblePosition } from '@3t3d/core'
import { TRPCError } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { z } from 'zod'

import { gameProcessorModel } from '@/models/game-processor.model'
import { gamesManagerModel } from '@/models/games-manager.model'
import { searchModel } from '@/models/search.model'
import { multiplayerGamesService } from '@/services'

import { authorizedProcedure, t } from '../trpc'

// Not resolved cases:
// 1. If player trying to connect to the same game while he already connected, he will not be able to connect
// 2. If player disconnected and he's trying to connect, then he need to get current state of the game

// Optimization:
// 1. Use cache to check if player available to make a mutation instead of database

const playerProcedure = authorizedProcedure
  .input(z.object({ gameId: z.number().int().positive() }))
  .use(async ({ next, ctx: { session }, input }) => {
    const gameEntry = await multiplayerGamesService.getGameById({
      id: input.gameId,
    })

    if (
      gameEntry.player1Id !== session.userId &&
      gameEntry.player2Id !== session.userId
    ) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }

    return next({ ctx: { gameId: gameEntry.id } })
  })

export const multiplayerGamesRouter = t.router({
  searchOpponent: authorizedProcedure.subscription(({ ctx: { session } }) => {
    // TODO: Add typings
    return observable((emit) => {
      searchModel.playerJoinedToQueue({ id: session.userId })

      const subscription = gamesManagerModel.onGameCreated(
        { userId: session.userId },
        (payload) => {
          emit.next(payload)
          emit.complete()
        },
      )

      return () => {
        subscription.unsubscribe()
        searchModel.playerLeftFromQueue({ id: session.userId })
      }
    })
  }),
  move: playerProcedure
    .input(
      z.object({
        coordinates: z
          .record(
            z.enum(['x', 'y', 'z']),
            z
              .number()
              .int()
              .min(1)
              .max(3)
              .refine((_value): _value is PossiblePosition => true),
          )
          .refine((obj): obj is Required<typeof obj> => {
            return Object.keys(obj).every(
              (key) => obj[key as keyof typeof obj] !== undefined,
            )
          }),
        shape: z.enum(['cross', 'cylinder', 'ring', 'plus']),
      }),
    )
    .mutation(async ({ ctx: { session, gameId }, input }) => {
      await gameProcessorModel.move({
        gameId,
        userId: session.userId,
        coordinates: input.coordinates,
        shape: input.shape,
      })
    }),
})
