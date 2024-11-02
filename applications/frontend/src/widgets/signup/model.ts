import { createEffect, createEvent, sample } from 'effector'
import { and, every, not, pending } from 'patronum'
import { z } from 'zod'

import { createField, zodAdapter } from '@/entities/form'
import { trpcClient } from '@/shared/api'
import { atom } from '@/shared/fabrics/atom'

export const signupModel = atom(() => {
  const signupFx = createEffect(trpcClient.auth.signUp.mutate)

  const formSubmitted = createEvent()
  const componentUnmounted = createEvent()

  const usernameField = createField('', {
    validate: { on: formSubmitted, fn: zodAdapter(z.string().min(4).max(32)) },
    clearOn: componentUnmounted,
  })
  const firstnameField = createField('', {
    validate: { on: formSubmitted, fn: zodAdapter(z.string().min(1).max(64)) },
    clearOn: componentUnmounted,
  })
  const lastnameField = createField('', {
    validate: { on: formSubmitted, fn: zodAdapter(z.string().max(64)) },
    clearOn: componentUnmounted,
  })
  const passwordField = createField('', {
    validate: { on: formSubmitted, fn: zodAdapter(z.string().min(1).max(64)) },
    clearOn: componentUnmounted,
  })

  const $isPending = pending([signupFx])
  const $isFormValid = every({
    predicate: null,
    stores: [
      usernameField.$errors,
      firstnameField.$errors,
      lastnameField.$errors,
      passwordField.$errors,
    ],
  })

  const precheckCompleted = sample({
    clock: formSubmitted,
    filter: and(not($isPending), $isFormValid),
  })

  const emptyFieldsOmitted = sample({
    clock: precheckCompleted,
    source: {
      username: usernameField.$value,
      firstName: firstnameField.$value,
      lastName: lastnameField.$value,
      password: passwordField.$value,
    },
    fn: ({ lastName, ...fields }) => ({
      lastName: lastName || undefined,
      ...fields,
    }),
  })

  sample({
    clock: emptyFieldsOmitted,
    target: signupFx,
  })

  // TODO: Finish it
  sample({
    clock: signupFx.doneData,
  })

  return {
    formSubmitted,
    usernameField,
    firstnameField,
    lastnameField,
    passwordField,
    $isPending,
    componentUnmounted,
  }
})
