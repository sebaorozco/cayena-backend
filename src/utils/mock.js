import { faker } from '@faker-js/faker'

export const generateMockProduct = () => ({
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.string.alphanumeric(6),
    price: parseFloat(faker.commerce.price()),
    stock: parseInt(faker.string.numeric()),
    category: faker.commerce.department(),
    thumbnails: faker.image.url(),
})