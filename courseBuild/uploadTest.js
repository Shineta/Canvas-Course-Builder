const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('/workspaces/Canvas-Course-Builder/test/server.js'); // Replace with the correct relative path to your server.js file

chai.use(chaiHttp);
const should = chai.should();

describe('Course Upload', () => {
  it('should upload a spreadsheet and return success message', (done) => {
    chai.request(server)
      .post('/upload')
      .field('courseNumber', '101')
      .field('canvasDomain', 'test.instructure.com')
      .field('accessKey', 'abc123')
      .field('coursePrefix', 'TestCourse')
      .attach('spreadsheet', '/path/to/test/spreadsheet.xlsx', 'spreadsheet.xlsx') // Update with the correct path
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Course successfully built.');
        done();
      });
  });

  it('should return an error for missing fields', (done) => {
    chai.request(server)
      .post('/upload')
      .field('courseNumber', '101')
      .field('canvasDomain', 'test.instructure.com')
      // Missing accessKey and coursePrefix
      .end((err, res) => {
        res.should.have.status(400); // Assuming your server returns a 400 status for bad requests
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should return an error for invalid input format', (done) => {
    chai.request(server)
      .post('/upload')
      .field('courseNumber', '101')
      .field('canvasDomain', 'invalid_domain')
      .field('accessKey', 'abc123')
      .field('coursePrefix', 'TestCourse')
      .attach('spreadsheet', '/path/to/invalid_file.txt', 'invalid_file.txt') // Update with the correct path
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should handle server errors gracefully', (done) => {
    chai.request(server)
      .post('/upload')
      .field('courseNumber', '101')
      .field('canvasDomain', 'test.instructure.com')
      .field('accessKey', 'abc123')
      .field('coursePrefix', 'TestCourse')
      .attach('spreadsheet', '/path/to/corrupted_file.xlsx', 'corrupted_file.xlsx') // Update with the correct path
      .end((err, res) => {
        res.should.have.status(500); // Server error status code
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
});

