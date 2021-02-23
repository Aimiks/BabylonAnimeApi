const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAll = function () {
  return prisma.anime.findMany({});
};

const get = function (id) {
  return prisma.anime.findFirst({ where: { id } });
};

const create = function (data) {
  return prisma.anime.create({ data });
};

const update = function (id, data) {
  return prisma.anime.update({ where: { id }, data });
};

const getEpisodes = function (id) {
  return prisma.anime.findFirst({ where: { id }, select: { episodes: true } });
};

/**
 * @param {Number} id
 * @param {*} data
 */
const addEpisode = function (id, idEpisode) {
  return prisma.anime.update({ where: { id }, data: { episodes: { connect: { id: idEpisode } } } });
};

module.exports = {
  getAll,
  get,
  create,
  update,
  getEpisodes,
  addEpisode,
};
