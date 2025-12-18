const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from frontend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/aitruth';

const questions = [
    {
        subject: "Math",
        text: "What is 2 + 2?",
        reference_answer: "4",
        difficulty: "Easy"
    },
    {
        subject: "Math",
        text: "Prove that the square root of 2 is irrational using proof by contradiction.",
        reference_answer: "Assume √2 is rational, so √2 = a/b where a and b are coprime integers. Then 2 = a²/b², so a² = 2b². This means a² is even, so a must be even. Let a = 2k. Then 4k² = 2b², so b² = 2k², meaning b² is even and b is even. But if both a and b are even, they share a common factor of 2, contradicting our assumption that they are coprime. Therefore, √2 must be irrational.",
        difficulty: "Hard"
    },
    {
        subject: "Math",
        text: "What is the Taylor series expansion of e^x around x = 0?",
        reference_answer: "The Taylor series expansion of e^x around x = 0 is: e^x = 1 + x + x²/2! + x³/3! + x⁴/4! + ... = Σ(x^n/n!) for n from 0 to infinity. This series converges for all real values of x.",
        difficulty: "Medium"
    },
    {
        subject: "Science",
        text: "Explain the process of photosynthesis in simple terms.",
        reference_answer: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water. In plants, photosynthesis generally involves the green pigment chlorophyll and generates oxygen as a byproduct. The general equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2.",
        difficulty: "Medium"
    },
    {
        subject: "History",
        text: "What were the main causes of World War I?",
        reference_answer: "The main causes of World War I are often summarized by the acronym M.A.I.N.: Militarism (arms race), Alliances (complex web of mutual defense treaties), Imperialism (competition for colonies), and Nationalism (desire for self-determination). The immediate trigger was the assassination of Archduke Franz Ferdinand of Austria-Hungary in Sarajevo on June 28, 1914.",
        difficulty: "Medium"
    }
];

async function populate() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db();
        const collection = db.collection('questions');

        // Clear existing questions
        await collection.deleteMany({});
        console.log('Cleared existing questions');

        // Insert new questions
        const result = await collection.insertMany(questions);
        console.log(`Inserted ${result.insertedCount} questions`);

    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        await client.close();
    }
}

populate();
