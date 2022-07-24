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
const issueCreatedResponse = {
  title: 'First Issue Title'
};
const bodyIssue = {
  body: 'First body Issue'
};

describe('Consume PUT method', () => {
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
  describe('POST method consumption for issues', () => {
    /* Create a new issue with POST method */
    let issueUrl;
    before(async () => {
      const response = await Access.post(`${urlBase}/repos/${githubUserName}/${repositoryName}/issues`, issueCreatedResponse);
      issueUrl = response;
    });
    it('POST method consumption for issues', () => {
      expect(issueUrl.status).to.equal(StatusCodes.CREATED);
    });
    it('PATCH method for issues created in PUT method', async () => {
      /* Update an issue created at POST method */
      const response = await Access.patch(`${issueUrl.data.url}`, bodyIssue);
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.data.title).to.equal(issueCreatedResponse.title);
      expect(response.data.body).to.equal(bodyIssue.body);
    });
  });
});
