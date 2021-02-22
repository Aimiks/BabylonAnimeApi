/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 */

/**
 * @param {any} parent
 * @param {{ searchString: string }} args
 * @param {{ prisma: Prisma }} ctx
 */
async function Animes(parent, args, ctx) {
  const results = await ctx.prisma.anime.findMany();
  return results;
}
async function Anime(parent, args, ctx) {
  const results = await ctx.prisma.anime.findUnique({ where: { id: args.id } });
  return results;
}

module.exports = {
  Animes,
  Anime,
};
