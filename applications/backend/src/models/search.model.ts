import { createEvent, createStore, sample } from 'effector'
import { spread } from 'patronum'

import { atom } from '@/fabrics/atom'

interface PlayerEntry {
  id: number
}

export const searchModel = atom(() => {
  const participantsFound = createEvent<Record<`player${1 | 2}`, PlayerEntry>>()
  const playerJoinedToQueue = createEvent<PlayerEntry>()
  const playerLeftFromQueue = createEvent<PlayerEntry>()

  const $waitingPlayers = createStore<PlayerEntry[]>([])

  sample({
    clock: playerJoinedToQueue,
    source: $waitingPlayers,
    fn: (waitingPlayers, joinedPlayer) => [...waitingPlayers, joinedPlayer],
    target: $waitingPlayers,
  })

  sample({
    clock: playerLeftFromQueue,
    source: $waitingPlayers,
    fn: (waitingPlayers, leftPlayer) =>
      waitingPlayers.filter(({ id }) => id !== leftPlayer.id),
    target: $waitingPlayers,
  })

  sample({
    clock: $waitingPlayers,
    filter: (waitingPlayers) => waitingPlayers.length >= 2,
    fn: (waitingPlayers) => {
      const [player1, player2, ...updatedWaitingPlayers] = waitingPlayers
      return { eventParams: { player1, player2 }, updatedWaitingPlayers }
    },
    target: spread({
      effectParams: participantsFound,
      updatedWaitingPlayers: $waitingPlayers,
    }),
  })

  return {
    playerJoinedToQueue,
    playerLeftFromQueue,
    participantsFound,
  }
})
