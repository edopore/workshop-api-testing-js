const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const user2Follow = 'aperdomob';
const gitHubUser = 'edopore';
const Access = axios.create({
  headers: {
    Authorization: `token ${process.env.ACCESS_TOKEN}`
  }
});

describe('Github Api Test', () => {
  it('PUT method to follow users', async () => {
    const response = await Access.put(`${urlBase}/user/following/${user2Follow}`);
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    expect(response.data).is.equal('');
  });
  it(`Verify following list to ensure you follow user ${user2Follow}`, async () => {
    const response = await Access.get(`${urlBase}/users/${gitHubUser}/following`);
    expect(response.data).to.containSubset([{ login: user2Follow }]);
  });
  it('PUT method again to verify idempotent method', async () => {
    const response = await Access.put(`${urlBase}/user/following/${user2Follow}`);
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    expect(response.data).is.equal('');
  });
});
