import { db } from '@drizzle/connection'
import { users } from '@drizzle/schema'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { test } from 'tap'

import { buildFastify } from '@/app'
import * as Jwt from '@/jwt'

test('Procedure `auth.signUp` - create user successfully with test database', async (t) => {
  const fastify = await buildFastify()

  const firstName = faker.person.fullName()
  const lastName = faker.person.lastName()
  const username = faker.internet.userName()
  const password = faker.internet.password()

  t.teardown(async () => {
    try {
      await db.delete(users)
    } catch (error) {
      console.error('Error when trying to delete users')
    }
    await fastify.close()
  })

  const response = await fastify.injectTRPC((router) =>
    router.auth.signUp({ firstName, lastName, username, password }),
  )
  const payload = response.json()

  if ('error' in payload) {
    return t.fail('Response returned error, but result expected', payload.error)
  }

  const createdUser = payload.result.data

  t.equal(createdUser.firstName, firstName)
  t.equal(createdUser.lastName, lastName)
  t.equal(createdUser.username, username)
})

test('Procedure `auth.signUp` - create user failed cause of existing username with test database', async (t) => {
  const fastify = await buildFastify()

  const username = faker.internet.userName()

  await db.insert(users).values({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username,
    passwordHash: await bcrypt.hash(faker.internet.password(), 7),
  })

  t.teardown(async () => {
    try {
      await db.delete(users)
    } catch (error) {
      console.error('Error when trying to delete users')
    }
    await fastify.close()
  })

  const response = await fastify.injectTRPC((router) =>
    router.auth.signUp({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username,
      password: faker.internet.password(),
    }),
  )
  const payload = response.json()

  if ('result' in payload) {
    return t.fail('Response returned result, but result error')
  }

  t.equal(payload.error.data.httpStatus, 400)
  t.equal(payload.error.message, 'USERNAME_EXIST')
})

test('Procedure `auth.login` - successfully user login with test database', async (t) => {
  const fastify = await buildFastify()

  const username = faker.internet.userName()
  const password = faker.internet.password()

  await db.insert(users).values({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username,
    passwordHash: await bcrypt.hash(password, 7),
  })

  t.teardown(async () => {
    try {
      await db.delete(users)
    } catch (error) {
      console.error('Error when trying to delete users')
    }
    await fastify.close()
  })

  const response = await fastify.injectTRPC((router) =>
    router.auth.login({
      username,
      password,
    }),
  )
  const payload = response.json()

  if ('error' in payload) {
    return t.fail('Response returned error, but result expected', payload.error)
  }

  const accessToken = payload.result.data.accessToken

  t.equal(Jwt.verifyAccess(accessToken).valid, true)

  const refreshTokenCookie = response.cookies.find(
    (cookie) => cookie.name === 'refresh_token',
  )
  if (!refreshTokenCookie) return t.fail('Refresh token cookie not found')

  const unsignedRefreshTokenCookie = fastify.unsignCookie(
    refreshTokenCookie.value,
  )
  if (!unsignedRefreshTokenCookie.valid)
    return t.fail('Refresh token cookie is invalid')

  t.equal(Jwt.verifyRefresh(unsignedRefreshTokenCookie.value).valid, true)
})
