process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Crop = require('../data_management/schema').Crop;

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Crop', () => {
    beforeEach((done) => { //Before each test we empty the database
        Crop.remove({}, (err) => { 
           done();         
        });     
    });
 /*
  * Test the /GET route
  */
  describe('/GET Crop', () => {
      it('it should GET Crop', (done) => {
        chai.request(server)
            .get('/crops')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

});
