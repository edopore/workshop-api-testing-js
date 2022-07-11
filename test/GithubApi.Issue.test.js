const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const githubUserName = 'edopore';
const repositoryName = 'workshop-api-testing-js';
const Access = axios.create({
  headers: {
    Authorization: `token ${process.env.ACCESS_TOKEN}`
  }
});

describe('Github Api Test', () => {
  it('Login User', async () => {
    /* Test to verify if account has at least 1 public repository */
    const response = await Access.get(`${urlBase}/user`);
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.public_repos).to.be.at.least(1);
  });
  it('GET method for repos and verify if repo exist', async () => {
    const repos = await Access.get(`${urlBase}/users/${githubUserName}/repos`);
    const repository = repos.data.find((element) => element.name === repositoryName);
    expect(repos.status).to.equal(StatusCodes.OK);
    /* Expect name of repository workshop-api-testing-js */
    expect(repository.name).to.equal(repositoryName);
    expect(repository.private).to.equal(false);
  });
  it('POST method for issues', async () => {
    /* Create a new issue with POST method */
    const issue = {
      title: 'First Issue Title'
    };
    const response = await Access.post(`${urlBase}/repos/${githubUserName}/${repositoryName}/issues`, issue);
    expect(response.status).to.equal(StatusCodes.CREATED);
  });
  it('PATCH method for issues created in PUT method', async () => {
    /* Update an issue created at POST method */
    const issueNumber = 9;
    const issue = {
      body: 'First body Issue'
    };
    const response = await Access.post(`${urlBase}/repos/${githubUserName}/${repositoryName}/issues/${issueNumber}`, issue);
    expect(response.status).to.equal(StatusCodes.OK);
  });
});
