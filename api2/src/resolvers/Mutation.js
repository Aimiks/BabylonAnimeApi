/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 */

/**
 * @param {any} parent
 * @param {{ searchString: string }} args
 * @param {{ prisma: Prisma }} ctx
 */
async function AddAnime(parent, args, ctx, info) {
  const newAnime = await ctx.prisma.anime.create({
    data: {
      id: args.id,
    },
  });
  return newAnime;
}

/**
 * @param {any} parent
 * @param {{ searchString: string }} args
 * @param {{ prisma: Prisma }} ctx
 */
async function CreateAnimeEpisode(parent, args, ctx, info) {
  const episode = await ctx.prisma.animeEpisode.create({
    data: {
      episodeNumber: args.episodeNumber,
      animeId: args.id,
    },
  });
  return episode;
}

module.exports = {
  AddAnime,
  CreateAnimeEpisode,
};
