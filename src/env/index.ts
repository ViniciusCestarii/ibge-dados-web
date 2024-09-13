import { z } from 'zod'

const envSchema = z.object({
  IBGE_BASE_URL: z
    .string()
    .url()
    .optional()
    .default('https://servicodados.ibge.gov.br/api/v3'),
  NODE_ENV: z.string().default('development'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

const env = _env.data

export default env
