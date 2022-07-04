const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await axios.get('https://httpbin.org/ip');
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await axios.get('https://httpbin.org/get', { query });
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.config.query).to.eql(query);
  });

  it('Consume HEAD Service', async () => {
    const response = await axios.head('https://httpbin.org/');
    expect(response.status).to.equal(StatusCodes.OK);
  });

  it('Consume PUT Service', async () => {
    const dataput = {
      name: 'Eduardo',
      age: '28',
      city: 'Mocoa'
    };
    const response = await axios.put('https://httpbin.org/put', dataput);
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.json).to.eql(dataput);
  });

  it('Consume PATCH Service', async () => {
    const datapatch = {
      id: 12,
      ip: '192.168.5.55',
      connected: 'false',
      username: 'figaro'
    };
    const response = await axios.patch('https://httpbin.org/patch', datapatch);
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.json).to.eql(datapatch);
  });

  it('Consume DELETE Service', async () => {
    const query = {
      id: 15
    };
    const response = await axios.delete('https://httpbin.org/delete', { query });
    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.data).to.equal('');
  });
});
