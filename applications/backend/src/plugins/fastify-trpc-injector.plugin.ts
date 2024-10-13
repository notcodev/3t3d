import {
  AnyProcedure,
  AnyRouter,
  ProcedureArgs,
  ProcedureRouterRecord,
  ProcedureType,
} from '@trpc/server'
import * as tRPCShared from '@trpc/server/shared'
import { InjectOptions, LightMyRequestResponse } from 'fastify'
import fp from 'fastify-plugin'
import querystring from 'node:querystring'

interface DecoratedProcedure<TProcedure extends AnyProcedure> {
  (input: ProcedureArgs<TProcedure['_def']>[0]): InjectConfig<TProcedure>
}

type DecoratedProcedureRecord<TProcedures extends ProcedureRouterRecord> = {
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<TProcedures[TKey]['_def']['record']>
    : TProcedures[TKey] extends AnyProcedure
      ? TProcedures[TKey]['_type'] extends 'subscription'
        ? { error: 'Subscriptions is currently unsupported' }
        : DecoratedProcedure<TProcedures[TKey]>
      : never
}

// Generic here is used to infer output response type
type InjectConfig<_T extends AnyProcedure> = {
  url: string
  headers?: { 'content-type': string }
} & ({ method: 'GET'; query: string } | { body: string; method: 'POST' })

type ProcedureOutput<TProcedure extends AnyProcedure> =
  TProcedure['_def']['_output_out']

interface InjectConfigGetter<
  TRouter extends AnyRouter,
  TProcedure extends AnyProcedure,
> {
  (
    proxy: DecoratedProcedureRecord<TRouter['_def']['record']>,
  ): InjectConfig<TProcedure>
}

type TRPCInjectOptions = Omit<
  InjectOptions,
  'path' | 'url' | 'query' | 'method' | 'payload' | 'body'
>

type TRPCInjectorResponse<TProcedure extends AnyProcedure> = Omit<
  LightMyRequestResponse,
  'json'
> & {
  json: () => {
    result: ProcedureOutput<TProcedure> extends void
      ? {}
      : { data: ProcedureOutput<TProcedure> }
  }
}

interface TRPCInjectorRequestCallback<TProcedure extends AnyProcedure> {
  (
    err: Error | undefined,
    response: TRPCInjectorResponse<TProcedure> | undefined,
  ): void
}

interface FastiyfyTRPCInjector<TRouter extends AnyRouter> {
  <TProcedure extends AnyProcedure>(
    getInjectConfig: InjectConfigGetter<TRouter, TProcedure>,
    options?: TRPCInjectOptions,
  ): Promise<TRPCInjectorResponse<TProcedure>>
}

interface FastiyfyTRPCInjector<TRouter extends AnyRouter> {
  <TProcedure extends AnyProcedure>(
    getInjectConfig: InjectConfigGetter<TRouter, TProcedure>,
    callback: TRPCInjectorRequestCallback<TProcedure>,
  ): void
}

interface FastiyfyTRPCInjector<TRouter extends AnyRouter> {
  <TProcedure extends AnyProcedure>(
    getInjectConfig: InjectConfigGetter<TRouter, TProcedure>,
    options: TRPCInjectOptions,
    callback: TRPCInjectorRequestCallback<TProcedure>,
  ): void
}

declare module 'fastify' {
  interface FastifyInstance {
    injectTRPC: FastiyfyTRPCInjector<AnyRouter>
    withTypedTRPCInjector: <TRouter extends AnyRouter>() => FastifyInstance & {
      injectTRPC: FastiyfyTRPCInjector<TRouter>
    }
  }
}

interface FastifyTRPCInjectorPluginOptions {
  router: AnyRouter
  prefix: `/${string}`
}

export const fastifyTRPCInjectorPlugin = fp(
  (fastify, { prefix, router }: FastifyTRPCInjectorPluginOptions, done) => {
    const def = router._def

    fastify.decorate(
      'injectTRPC',
      (
        getInjectConfig,
        callbackOrOptions?:
          | TRPCInjectOptions
          | TRPCInjectorRequestCallback<AnyProcedure>,
        callback?: TRPCInjectorRequestCallback<AnyProcedure>,
      ): Promise<TRPCInjectorResponse<AnyProcedure>> | void => {
        const injectConfig = getInjectConfig(
          tRPCShared.createRecursiveProxy(
            ({ path, args }): InjectConfig<AnyProcedure> => {
              const fullPath = path.join('.')
              const procedure = def.procedures[fullPath] as AnyProcedure

              let type: ProcedureType = 'query'
              if (procedure._def.mutation) {
                type = 'mutation'
              } else if (procedure._def.subscription) {
                type = 'subscription'
              }

              switch (type) {
                case 'query':
                  return {
                    url: [prefix, ...path].join('/'),
                    query: querystring.stringify({
                      input: JSON.stringify(args[0]), // TODO: Add superjson support
                    }),
                    method: 'GET',
                  }
                case 'mutation':
                  return {
                    url: [prefix, ...path].join('/'),
                    body: JSON.stringify(args[0]), // TODO: Add superjson support
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                  }
                case 'subscription':
                  break
                default:
              }

              return null!
            },
          ) as any,
        )
        let injectOptions: InjectOptions = injectConfig

        const inject = (
          options: InjectOptions,
          callback?: TRPCInjectorRequestCallback<AnyProcedure>,
        ): Promise<TRPCInjectorResponse<AnyProcedure>> | void => {
          function modifyResponse(response: LightMyRequestResponse) {
            return {
              ...response,
              json() {
                return JSON.parse(this.body)
              },
            }
          }

          if (callback) {
            return fastify.inject(options, (error, response) => {
              const modifiedResponse = response
                ? modifyResponse(response)
                : undefined

              callback(error, modifiedResponse)
            })
          }

          return fastify.inject(options).then(modifyResponse)
        }

        if (callbackOrOptions && typeof callbackOrOptions === 'object') {
          injectOptions = {
            ...injectOptions,
            ...callbackOrOptions,
          }

          return inject(injectOptions, callback)
        }

        return inject(injectOptions, callbackOrOptions)
      },
    )
    fastify.decorate('withTypedTRPCInjector', () => fastify)

    done()
  },
)
