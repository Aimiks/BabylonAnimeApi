const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Anime = require("./resolvers/Anime");
const AnimeEpisode = require("./resolvers/AnimeEpisode");
const Download = require("./resolvers/Download");
const File = require("./resolvers/File");

const resolvers = {
  Query,
  Mutation,
  Anime,
  AnimeEpisode,
  Download,
  File,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
