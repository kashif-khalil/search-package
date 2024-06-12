const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function searchDatabase(params) {
    const { searchTerm, tableName, columns } = params;

    if (!searchTerm) {
        throw new Error("No search term given.");
    }

    const searchPattern = `%${searchTerm.toLowerCase()}%`;
    const columnConditions = columns.map(column => `LOWER("${column}") LIKE ${searchPattern}`).join(' OR ');

    try {
        const query = `SELECT * FROM "${tableName}" WHERE ${columnConditions};`;
        const results = await prisma.$queryRawUnsafe(query);
        return results;
    } catch (error) {
        console.error("Error fetching data: ", error);
        throw new Error("Error fetching data");
    }
}

module.exports = searchDatabase;
