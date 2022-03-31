import { createClient, RedisClientType } from "redis";

export type SetCacheType = {
    endpoint: string;
    args: string[];
    value: string;
    expiresAt?: Date;
}

const redisClient: RedisClientType = createClient({
  url: 'redis://localhost:6379'
});

const client_connection_promise: Promise<void> = redisClient.connect()

export const useRedis = async (): Promise<RedisClientType> => {
    await client_connection_promise;
    return redisClient;
}

export const closeRedis = async (): Promise<void> => {
    return await redisClient.quit();
}

export const getCache = async ({ endpoint, args }: any) => {
    const key = JSON.stringify({ endpoint, args });
    return await redisClient.get(key);
}

export const setCache = async ({ endpoint, args, value, expiresAt }: SetCacheType) => {
    const key = JSON.stringify({ endpoint, args });
    const set_args: any = {}
    if (expiresAt) {
        const expiresAt__milliseconds = expiresAt?.getTime() - new Date().getTime()
        const expiresAt__seconds = expiresAt__milliseconds / 100
        set_args.EX = expiresAt__seconds
    }
    await redisClient.set(key, value, set_args);
}

// cache hit or set/get
export const cache_hsg = async ({ endpoint, args, fallback, expiresAt }: any) => {
    const cached_value = await getCache({ endpoint, args });
    if (cached_value) return JSON.parse(cached_value);
    const value = await fallback.apply(undefined, args);
    await setCache({ 
        endpoint, 
        args,
        expiresAt,
        value: JSON.stringify(value) 
    })
    return value;
}

export default redisClient;