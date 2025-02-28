import { Router } from "express";

import { faker } from "@faker-js/faker";
import { createHash } from "../utils/index.js";

import __dirname from "../utils/index.js";

import petModel from "../dao/models/Pet.js";
import userModel from "../dao/models/User.js";

const router = Router();

// Módulo de Mocking para usuarios
const generateMockUser = async () => {
  const password = await createHash("coder123", 10);
  return {
    _id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: password,
    role: faker.helpers.arrayElement(["user", "admin"]),
    pets: [],
  };
};

// Endpoint para generar 50 usuarios mock
router.get("/mockingusers", async (req, res) => {
  const users = [];
  for (let i = 0; i < 50; i++) {
    users.push(await generateMockUser());
  }
  res.send({ status: "success", data: users });
});

router.get("/mockingpets", (req, res) => {
  const pets = [];
  const speciesList = ["dog", "cat", "fish"];

  for (let i = 0; i < 100; i++) {
    pets.push({
      name: faker.person.firstName(),
      specie: faker.helpers.arrayElement(speciesList),
      birthDate: faker.date
        .birthdate({ min: 1, max: 15, mode: "age" })
        .toISOString()
        .split("T")[0],
    });
  }
  res.send({ status: "success", payload: pets });
});

router.post("/generateData", async(req, res) => {
  try {
    const { users, pets } = req.body;
    if (!users || !pets) {
      return res
        .status(400)
        .json({ error: 'Se requieren los parámetros "users" y "pets".' });
    }

    // Generar e insertar usuarios
    const listUsers = [];
    console.log("Generando usuarios...");
  for (let i = 0; i < users; i++) {
    listUsers.push (await generateMockUser());
  }
  console.log(listUsers);
  userModel.insertMany(listUsers);

    // Generar e insertar mascotas
    console.log("Generando mascotas...");
    const pet = [];
    const speciesList = ["dog", "cat", "fish"];

    for (let i = 0; i < pets; i++) {
      pet.push({
        name: faker.person.firstName(),
        specie: faker.helpers.arrayElement(speciesList),
        birthDate: faker.date
          .birthdate({ min: 1, max: 15, mode: "age" })
          .toISOString()
          .split("T")[0],
      });
    }
    petModel.insertMany(pet);

    res.json({
      message: `Se generaron e insertaron ${users} usuarios y ${pets} mascotas.`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
