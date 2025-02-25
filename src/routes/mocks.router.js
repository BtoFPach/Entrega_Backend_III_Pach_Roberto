import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';
import petsController from '../controllers/pets.controller.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const router = Router();


// Módulo de Mocking para usuarios
const generateMockUser = () => {
    return {
      _id: faker.database.mongodbObjectId(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: bcrypt.hash('coder123'),
      role: faker.helpers.arrayElement(['user', 'admin']),
      pets: [],
    };
  };

  // Endpoint para generar 50 usuarios mock
router.get('/mockingusers',  (req, res) => {
      const users = [];
      for (let i = 0; i < 50; i++) {
        users.push(generateMockUser());
      }
      res.send({status: "success", data: users})
    })
  

router.get("/mockingpets",(req,res)=> {
    const pets = []
    const speciesList = ["dog","cat","fish"]

    for(let i=0;i<100;i++){
        pets.push({
            name:faker.person.firstName(),
            specie:faker.helpers.arrayElement(speciesList),
            birthDate:faker.date.birthdate({min:1,max:15,mode:"age"}).toISOString().split("T")[0]
        })
    }
    res.send({status:"success",payload:pets})
})


router.post('/generateData',(req, res) => {
    try {
      const { users, pets } = req.body;
      if (!users || !pets) {
        return res.status(400).json({ error: 'Se requieren los parámetros "users" y "pets".' });
      }
  
      // Generar e insertar usuarios
      for (let i = 0; i < users; i++) {
        const user = generateMockUser();
        sessionsController.register(user);
      }
  
      // Generar e insertar mascotas
      const pet= []
      const speciesList = ["dog","cat","fish"]
  
      for(let i=0;i<pets;i++){
          pet.push({
              name:faker.person.firstName(),
              specie:faker.helpers.arrayElement(speciesList),
              birthDate:faker.date.birthdate({min:1,max:15,mode:"age"}).toISOString().split("T")[0]
          })
      }
      petsController.createPet(pet);
  
      res.json({ message: `Se generaron e insertaron ${users} usuarios y ${pets} mascotas.` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  export default router;