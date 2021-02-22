/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 */

/**
 * @param {any} parent
 * @param {{ searchString: string }} args
 * @param {{ prisma: Prisma }} ctx
 */
async function downloadedFile(parent, args, ctx) {
  return await ctx.prisma.download.findUnique({ where: { id: parent.id } }).downloadedFile();
}
async function episode(parent, args, ctx) {
  return await ctx.prisma.download.findUnique({ where: { id: parent.id } }).episode();
}

module.exports = {
  downloadedFile,
  episode,
};
