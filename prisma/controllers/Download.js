const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAll = function () {
  return prisma.download.findMany({});
};

const get = function (id) {
  return prisma.download.findFirst({ data: { id: id } });
};

const create = function (data) {
  return prisma.download.create({ data });
};

const update = function (id, data) {
  return prisma.download.update({ where: { id }, data });
};
module.exports = {
  getAll,
  get,
  create,
  update,
};
