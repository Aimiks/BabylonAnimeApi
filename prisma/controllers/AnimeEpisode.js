const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAll = function () {
  return prisma.animeEpisode.findMany({});
};

const get = function (id) {
  return prisma.animeEpisode.findFirst({ data: { id: id } });
};

const create = function (data) {
  return prisma.animeEpisode.create({ data });
};

const update = function (id, data) {
  return prisma.animeEpisode.update({ where: { id }, data });
};

const getFromAnime = function (id) {
  return prisma.animeEpisode.findMany({ data: { animeId: id } });
};

const addDownload = function (id, idDownload) {
  return prisma.animeEpisode.update({ where: { id: id }, data: { download: { connect: { id: idDownload } } } });
};

module.exports = {
  getAll,
  get,
  create,
  update,
  getFromAnime,
  addDownload,
};
