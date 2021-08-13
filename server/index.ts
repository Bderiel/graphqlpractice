import "reflect-metadata";
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server';
import { buildSchemaSync } from 'type-graphql'
import { resolvers } from '@generated/type-graphql';
import prisma from './libs/prisma';
import { seedDB } from './seed';

const schema = buildSchemaSync({
    resolvers,
    validate: false,
})

const server = new ApolloServer({
    schema,
    context: () => ({ prisma }),
    plugins: [
        ApolloServerPluginLandingPageLocalDefault({
            // options
        })
    ]
});
server.listen({
    port: 4000,
});

// seedDB()