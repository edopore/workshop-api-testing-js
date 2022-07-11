const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const company = 'Perficient Latam';
const name = 'Alejandro Perdomo';
const repoName = 'jasmine-json-report';
const desc = 'A Simple Jasmine JSON Report';

describe('Github Api Test', () => {
  it('GET method consumption', async () => {
    const response = await axios.get(`${urlBase}/users/${githubUserName}`);
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.login).to.equal(githubUserName);
    expect(response.data.company).to.equal(company);
    expect(response.data.name).to.equal(name);
  });
  it('GET method for repos', async () => {
    const repos = await axios.get(`${urlBase}/users/${githubUserName}/repos`);
    const repository = repos.data.find((element) => element.name === repoName);
    expect(repos.status).to.equal(StatusCodes.OK);
    /* Expect name of repository jasmine-json-report */
    expect(repository.name).to.equal(repoName);
    expect(repository.private).to.equal(false);
    expect(repository.description).to.equal(desc);
  });

  it('GET zip file repository', async () => {
    /* Download zip file repo https://api.github.com/repos/aperdomob/jasmine-json-report/zipball/master */
    const repos = await axios.get(`${urlBase}/repos/${githubUserName}/${repoName}/zipball/master`);
    expect(repos.status).to.equal(StatusCodes.OK);
  });
  it('GET repos content', async () => {
    const repoContent = await axios.get(`${urlBase}/repos/${githubUserName}/${repoName}/contents`);
    expect(repoContent.status).to.equal(StatusCodes.OK);
    expect(repoContent.data).to.containSubset([{ name: 'README.md' }]);
    expect(repoContent.data).to.containSubset([{ path: 'README.md' }]);
    expect(repoContent.data).to.containSubset([{ sha: '360eee6c223cee31e2a59632a2bb9e710a52cdc0' }]);
  });
  it('GET README.md file from repository', async () => {
    /* Download README.md file repo https://raw.githubusercontent.com/aperdomob/jasmine-json-report/master/README.md */
    const fileContent = await axios.get(`https://raw.githubusercontent.com/${githubUserName}/${repoName}/master/README.md`);
    expect(fileContent.status).to.equal(StatusCodes.OK);
  });
});
