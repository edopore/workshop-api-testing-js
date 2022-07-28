const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const Access = axios.create({
  headers: {
    Authorization: `token ${process.env.ACCESS_TOKEN}`
  }
});
const gistData = {
  description: 'Example of a gist',
  files: {
    'README.md': {
      content: 'This is a gist example'
    }
  }
};
describe('DELETE method consumption and resources that does not exist', () => {
  let gist;
  before(async () => {
    gist = await Access.post(`${urlBase}/gists`, gistData);
  });
  it('Create a gist with POST and Promises', () => {
    expect(gist.status).to.equal(StatusCodes.CREATED);
    expect(gist.data).to.containSubset(gistData);
  });
  it('Use Hypermedia to search gist created', async () => {
    const gistConsult = await Access.get(`${gist.data.url}`);
    expect(gistConsult.status).to.equal(StatusCodes.OK);
  });
  it('Use DELETE method to erase gist', async () => {
    const deleteGist = await Access.delete(`${gist.data.url}`);
    expect(deleteGist.status).to.equal(StatusCodes.NO_CONTENT);
  });
  it('Try to get deleted gist', async () => {
    let gistDeletedConsult;
    try {
      gistDeletedConsult = await Access.get(`${gist.data.url}`);
    } catch (error) {
      gistDeletedConsult = error;
    }
    expect(gistDeletedConsult.response.status).to.equal(StatusCodes.NOT_FOUND);
  });
});
