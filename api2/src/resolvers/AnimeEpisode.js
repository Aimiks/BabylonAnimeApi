/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 */

/**
 * @param {any} parent
 * @param {{ searchString: string }} args
 * @param {{ prisma: Prisma }} ctx
 */
async function download(parent, args, ctx) {
  return await ctx.prisma.animeEpisode.findUnique({ where: { id: parent.id } }).download();
}
async function anime(parent, args, ctx) {
  return await ctx.prisma.animeEpisode.findUnique({ where: { id: parent.id } }).anime();
}

module.exports = {
  download,
  anime,
};
