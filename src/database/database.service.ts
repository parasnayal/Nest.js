import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import {
  Pool,
  type PoolClient,
  type QueryResult,
  type QueryResultRow,
} from 'pg';

import type { EnvConfig } from '../config/env.validation.js';

@Injectable()
export class DatabaseService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(DatabaseService.name);

  private readonly pool: Pool;

  constructor(private readonly config: ConfigService<EnvConfig, true>) {
    this.pool = new Pool({
      connectionString: this.config.get('DATABASE_URL', { infer: true }),

      max: this.config.get('DATABASE_POOL_MAX', { infer: true }),

      connectionTimeoutMillis: this.config.get(
        'DATABASE_CONNECTION_TIMEOUT_MS',
        { infer: true },
      ),

      idleTimeoutMillis: this.config.get('DATABASE_IDLE_TIMEOUT_MS', {
        infer: true,
      }),
    });

    this.pool.on('error', (error) => {
      this.logger.error('Idle PostgreSQL connection error', error.stack);
    });
  }

  // Verify that PostgreSQL is reachable at startup.
  async onApplicationBootstrap(): Promise<void> {
    await this.pool.query('SELECT 1');

    this.logger.log('PostgreSQL connection verified');
  }

  // Run normal SQL queries.
  async query<T extends QueryResultRow>(
    sql: string,
    params: unknown[] = [],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(sql, params);
  }

  // Acquire a dedicated client for transactions.
  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  // Useful for monitoring the pool.
  getPoolStats() {
    return {
      total: this.pool.totalCount,
      idle: this.pool.idleCount,
      waiting: this.pool.waitingCount,
    };
  }

  // Close connections during application shutdown.
  async onApplicationShutdown(): Promise<void> {
    this.logger.log('Closing PostgreSQL pool');

    await this.pool.end();

    this.logger.log('PostgreSQL pool closed');
  }

  async withTransaction<T>(
    work: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();

    let discardClient = false;

    try {
      await client.query('BEGIN');

      const result = await work(client);

      await client.query('COMMIT');

      return result;
    } catch (error) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        discardClient = true;

        this.logger.error(
          'Transaction rollback failed',
          rollbackError instanceof Error
            ? rollbackError.stack
            : String(rollbackError),
        );
      }

      throw error;
    } finally {
      client.release(discardClient);
    }
  }
}
