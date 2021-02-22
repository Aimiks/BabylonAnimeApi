/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 */

/**
 * @param {any} parent
 * @param {{ searchString: string }} args
 * @param {{ prisma: Prisma }} ctx
 */
async function download(parent, args, ctx) {
  return await ctx.prisma.file.findUnique({ where: { id: parent.id } }).download();
}
module.exports = {
  download,
};
