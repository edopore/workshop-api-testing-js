const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const md5 = require('md5');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const company = 'Perficient Latam';
const name = 'Alejandro Perdomo';
const repoName = 'jasmine-json-report';
const desc = 'A Simple Jasmine JSON Report';
const fileName = 'README.md';

describe('Github Api Test', () => {
  let userResponse;

  before(async () => {
    userResponse = await axios.get(`${urlBase}/users/${githubUserName}`);
  });

  it('GET method consumption', () => {
    expect(userResponse.status).to.equal(StatusCodes.OK);
    expect(userResponse.data.login).to.equal(githubUserName);
    expect(userResponse.data.company).to.equal(company);
    expect(userResponse.data.name).to.equal(name);
  });
  describe('Hypermedia', () => {
    let repository;
    before(async () => {
      const repositoryRespose = await axios.get(`${userResponse.data.repos_url}`);
      repository = repositoryRespose.data.find((Repo) => Repo.name === repoName);
    });
    it('GET method for repos', () => {
      expect(repository.name).to.equal(repoName);
      expect(repository.private).to.equal(false);
      expect(repository.description).to.equal(desc);
    });
    it('Downloading by zip', async () => {
      // code to verify the zip download
      const fileDownload = await axios.get(`${repository.url}/zipball/master`);
      expect(fileDownload.status).to.equal(StatusCodes.OK);
      expect(fileDownload.headers).to.contain({ 'content-type': 'application/zip' });
    });
    describe('GET repos content', () => {
      // code to verify the readme and to download and verify the md5
      let fileDownload;
      let readmeFile;

      before(async () => {
        fileDownload = await axios.get(`${repository.url}/contents`);
        readmeFile = fileDownload.data.find((file) => file.name === fileName);
      });
      it('GET README.md file info', () => {
        expect(fileDownload.data).to.containSubset([{
          name: 'README.md',
          path: 'README.md',
          sha: '360eee6c223cee31e2a59632a2bb9e710a52cdc0'
        }]);
        it('Download README.md file and check md5', async () => {
          const fileContent = await axios.get(`${readmeFile.download_url}`);
          expect(fileContent.status).to.equal(StatusCodes.OK);
          expect(md5(fileContent.data)).to.equal('497eb689648cbbda472b16baaee45731');
        });
      });
    });
  });
});
