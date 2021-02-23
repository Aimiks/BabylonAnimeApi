const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAll = function () {
  return prisma.file.findMany({});
};

const get = function (id) {
  return prisma.file.findFirst({ data: { id: id } });
};

const create = function (data) {
  return prisma.file.create({ data });
};

const update = function (id, data) {
  return prisma.anime.update({ where: { id }, data });
};

module.exports = {
  getAll,
  get,
  create,
  update,
};
