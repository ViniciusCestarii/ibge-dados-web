import { z } from 'zod'

const isDevelopment = process.env.NODE_ENV === 'development'

const envSchema = z.object({
  IBGE_BASE_URL: z
    .string()
    .url()
    .optional()
    .default('https://servicodados.ibge.gov.br/api/v3'),
  SENTRY_AUTH_TOKEN: isDevelopment ? z.string().optional() : z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

const env = _env.data

export default env
