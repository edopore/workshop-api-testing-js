const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const id = '1f6d49f7c2c2c79e9d5c8d300210bb6d';
const Access = axios.create({
  headers: {
    Authorization: `token ${process.env.ACCESS_TOKEN}`
  }
});

describe('Github API test', () => {
  it('POST to make a gist with promises', async () => {
    const gist = {
      description: 'Example of my first gist',
      public: true,
      files: {
        'README.md': {
          content: 'Congrats readme lalala .com'
        }
      }
    };
    const response = await Access.post(`${urlBase}/gists`, gist);
    expect(response.status).to.equal(StatusCodes.CREATED);
    expect(response.data.public).to.equal(true);
    expect(response.data.description).containSubset(gist.description);
    expect(response.data.files['README.md'].content).containSubset(gist.files['README.md'].content);
  });
  it('GET method to consume gists', async () => {
    const response = await Access.get(`${urlBase}/gists/${id}`);
    expect(response.status).to.equal(StatusCodes.OK);
    console.log(response.data);
  });
  it('DELETE method for gist queried', async () => {
    const response = await Access.delete(`${urlBase}/gists/${id}`);
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
  });
  it('GET method to consume gists after DELETE method', async () => {
    const response = await Access.get(`${urlBase}/gists/${id}`);
    console.log(response);
    expect(response.status).to.equal(StatusCodes.NOT_FOUND);
  });
});
