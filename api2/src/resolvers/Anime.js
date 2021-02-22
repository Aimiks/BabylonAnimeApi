/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 */

/**
 * @param {any} parent
 * @param {{ searchString: string }} args
 * @param {{ prisma: Prisma }} ctx
 */
async function episodes(parent, args, ctx) {
  return await ctx.prisma.anime.findUnique({ where: { id: parent.id } }).episodes();
}
module.exports = {
  episodes,
};
