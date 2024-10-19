const request = require('supertest')
const app = require('../app');

//Test status code 200
describe('Product API Tests', () => {
     it('should return status code 200', async () => {
	const res = await request(app).get('/products');
	expect(res.statusCode).toBe(200);
	});
});

//Test return list of products
describe('GET /products', () => {
     it('should return all products', async () => {
	const products = await request(app).get('/products');
	expect(products.statusCode).toBe(200);
	expect(products.body).toEqual([
		{ id: 1, name: 'Laptop', price: 1000, stock: 5 },
		{ id: 2, name: 'Smartphone', price: 600, stock: 10 } ]);
	});
});

//Test products by ID
describe('GET /products/:id', () => {
     it('should return a product by ID', async () => {
	const id = await request(app).get('/products/1');
	expect(id.statusCode).toBe(200);
	expect(id.body).toEqual({ id: 1, name: 'Laptop', price: 1000, stock: 5 })
	});
         
    it('should return 404 if product not found', async () => {
	const id = await request(app).get('/products/99');
	expect(id.statusCode).toBe(404);
	expect(id.body).toEqual({ message: 'Product not found' });
	});
});

//Test added a new product
describe('POST /products', () => {
   it('should add a new product', async () => {
	const product = await request(app)
	   .post('/products')
	   .send({ name: 'GPU', price: 800, stock: 20 });
	expect(product.statusCode).toBe(201);
	expect(product.body).toMatchObject({ id: 3, name: 'GPU', price: 800, stock: 20 })
	});
});

//Test update product
describe('PUT /products/:id', () => {
   it('should update an existing product', async () => {
	const update = await request(app)
	   .put('/products/1')
	   .send({ id: 1, name: 'Laptop', price: 1400, stock: 2 });
	expect(update.statusCode).toBe(200);
	expect(update.body).toMatchObject({ id: 1, name: 'Laptop', price: 1400, stock: 2 });
	});

//Test update product that does not exists
   it('should return 404 if product not found', async () => {
	const update = await request(app)
	   .put('/products/9')
	   .send({ id: 9, name: 'Avocado', price: 5, stock: 100 });
	expect(update.statusCode).toBe(404);
	expect(update.body).toHaveProperty('message', 'Product not found');
	});

//Test upate only one field
   it('should return only one update field', async () => {
	const update = await request(app)
	   .put('/products/1')
	   .send({ price: 1500 });
	expect(update.statusCode).toBe(200);
	expect(update.body).toMatchObject({ id: 1, name: 'Laptop', price: 1500, stock: 2 });
	});

//Test not change anything
   it('should not change anything', async () => {
	const update = await request(app)
	   .put('/products/1')
	   .send({});
	expect(update.statusCode).toBe(200);
	expect(update.body).toMatchObject({ id: 1, name: 'Laptop', price: 1500, stock: 2 });
	});
});

//Test delete product
describe('DELETE /products/:id', () => {
   it('should delete a product', async () => {
	const productid = await request(app)
	   .delete('/products/1')
	   expect(productid.statusCode).toBe(200);
	   expect(productid.body).toHaveProperty('message', 'Product deleted' );
	});

//Test delete product that does not exists
   it('should return 404 if product not found', async () => {
	const productid = await request(app)
	   .delete('/products/9')
	   expect(productid.statusCode).toBe(404);
	   expect(productid.body).toHaveProperty('message', 'Product not found' );
	});
});
