import { ObjectId } from 'mongodb';
import { faker } from '@faker-js/faker/locale/fr';
import bcrypt from 'bcrypt';
import UserModel from '@/models/userModel';
import UserPhotoModel from '@/models/userPhotoModel';
import SwipeModel from '@/models/swipeModel';
import MatchModel from '@/models/matchModel';
import MessageModel from '@/models/messageModel';

// Fonction pour générer un hash de mot de passe
const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

// Compte admin principal
const mainUser = {
    _id: new ObjectId(),
    firstName: "Admin",
    lastName: "IPSSI",
    email: "admin@ipssi.fr",
    password: hashPassword("adminpassword"),
    gender: "male",
    dateOfBirth: new Date("1990-01-01"),
    bio: "Compte administrateur principal",
    location: "Paris",
    preferences: {
        gender: "female",
        ageRange: {
            min: 20,
            max: 40
        }
    },
    createdAt: new Date(),
    updatedAt: new Date()
};

// Génération de 50 utilisateurs
const otherUsers = Array.from({ length: 50 }, () => {
    const gender = faker.helpers.arrayElement(['male', 'female']) as 'male' | 'female';
    const firstName = gender === 'male' ? faker.person.firstName('male') : faker.person.firstName('female');
    return {
        _id: new ObjectId(),
        firstName,
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: hashPassword(faker.internet.password()),
        gender,
        dateOfBirth: faker.date.between({ from: '1980-01-01', to: '2000-12-31' }),
        bio: faker.lorem.paragraph(),
        location: faker.location.city(),
        preferences: {
            gender: faker.helpers.arrayElement(['male', 'female', 'both']),
            ageRange: {
                min: faker.number.int({ min: 18, max: 30 }),
                max: faker.number.int({ min: 31, max: 50 })
            }
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
    };
});

// Photos pour le compte principal (utilisant des images réelles de placeholder)
const mainUserPhotos = Array.from({ length: 3 }, (_, index) => ({
    _id: new ObjectId(),
    userId: mainUser._id,
    photoUrl: `https://picsum.photos/400/600?random=${index}`,
    createdAt: new Date(),
    updatedAt: new Date()
}));

// Photos pour les autres utilisateurs
const otherUsersPhotos = otherUsers.flatMap(user => 
    Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, (_, index) => ({
        _id: new ObjectId(),
        userId: user._id,
        photoUrl: `https://picsum.photos/400/600?random=${user._id.toString()}${index}`,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
    }))
);

// Génération des swipes (25 likes, 25 dislikes pour l'admin)
const swipes = otherUsers.slice(0, 50).map((user, index) => {
    const isLike = index < 25; // Les 25 premiers sont des likes
    return {
        _id: new ObjectId(),
        userId: mainUser._id,
        targetId: user._id,
        direction: isLike ? 'LIKE' : 'DISLIKE',
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent()
    };
});

// Swipes réciproques pour créer des matches (15 utilisateurs parmi les likes)
const reciprocalSwipes = otherUsers.slice(0, 15).map(user => ({
    _id: new ObjectId(),
    userId: user._id,
    targetId: mainUser._id,
    direction: 'LIKE',
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent()
}));

// Création des matches pour les swipes réciproques
const matches = otherUsers.slice(0, 15).map(user => ({
    _id: new ObjectId(),
    user1_id: mainUser._id,
    user2_id: user._id,
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent()
}));

// Génération de messages pour chaque match
const messages = matches.flatMap(match => 
    Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => {
        const isFromMain = faker.datatype.boolean();
        return {
            _id: new ObjectId(),
            matchId: match._id,
            senderId: isFromMain ? mainUser._id : match.user2_id,
            content: faker.lorem.sentence(),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent()
        };
    })
);

export const fixtures = {
    users: [mainUser, ...otherUsers],
    photos: [...mainUserPhotos, ...otherUsersPhotos],
    swipes: [...swipes, ...reciprocalSwipes],
    matches,
    messages
};

// Script d'insertion
export const insertFixtures = async () => {
    try {
        // Suppression des données existantes
        await Promise.all([
            UserModel.deleteMany({}),
            UserPhotoModel.deleteMany({}),
            SwipeModel.deleteMany({}),
            MatchModel.deleteMany({}),
            MessageModel.deleteMany({})
        ]);

        // Insertion des nouvelles données
        await Promise.all([
            UserModel.insertMany(fixtures.users),
            UserPhotoModel.insertMany(fixtures.photos),
            SwipeModel.insertMany(fixtures.swipes),
            MatchModel.insertMany(fixtures.matches),
            MessageModel.insertMany(fixtures.messages)
        ]);

        console.log('Fixtures insérées avec succès !');
    } catch (error) {
        console.error('Erreur lors de l\'insertion des fixtures:', error);
    }
}; 