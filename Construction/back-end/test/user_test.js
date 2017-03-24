process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../data_management/schema').User;

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('User', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
           done();         
        });     
    });
 /*
  * Test the /GET route
  */
  describe('/GET user', () => {
      it('it should GET user', (done) => {
        chai.request(server)
            .get('/users')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  /*
  * Test the /POST route
  */
  describe('/POST login', () => {
      it('it should login user', (done) => {
        chai.request(server)
            .post('/users/login')
            .set('Content-Type', 'application/json')
            .send({'name':'jdoe1', 'password':'chageme1245'})
            .end((err, res) => {
                res.should.have.status(404);
              done();
            });
      });
  });

});
