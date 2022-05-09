import { Prisma } from "@prisma/client";
import { prisma } from "../database.js";
import { CreateRecommendationData } from "../services/recommendationsService.js";

async function create(createRecommendationData: CreateRecommendationData) {
  await prisma.recommendation.create({
    data: createRecommendationData,
  });
}

interface FindAllWhere {
  score: number;
  scoreFilter: "lte" | "gt";
}

function findAll(findAllWhere?: FindAllWhere) {
  const filter = getFindAllFilter(findAllWhere);

  return prisma.recommendation.findMany({
    where: filter,
    orderBy: { id: "desc" },
    take: 10
  });
}

function getAmountByScore(take: number) {
  return prisma.recommendation.findMany({
    orderBy: { score: "desc" },
    take,
  });
}

function getFindAllFilter(
  findAllWhere?: FindAllWhere
): Prisma.RecommendationWhereInput {
  if (!findAllWhere) return {};

  const { score, scoreFilter } = findAllWhere;

  return {
    score: { [scoreFilter]: score },
  };
}

function find(id: number) {
  return prisma.recommendation.findUnique({
    where: { id },
  });
}

function findByName(name: string) {
  return prisma.recommendation.findUnique({
    where: { name },
  });
}

async function updateScore(id: number, operation: "increment" | "decrement") {
  return prisma.recommendation.update({
    where: { id },
    data: {
      score: { [operation]: 1 },
    },
  });
}

async function remove(id: number) {
  await prisma.recommendation.delete({
    where: { id },
  });
}

async function truncate(){
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
}

async function seed(){
  await prisma.$executeRaw`
  INSERT INTO recommendations ("name", "youtubeLink", "score")
  VALUES
  ('Chitãozinho E Xororó - Evidências', 'https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO', 300),
  ('Falamansa - Xote dos Milagres', 'https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO', 0),
  ('No time to dance', 'https://www.youtube.com/watch?v=6U-bI3On1Ww', -4)
  `
}

export const recommendationRepository = {
  create,
  findAll,
  find,
  findByName,
  updateScore,
  getAmountByScore,
  remove,
  truncate,
  seed
};