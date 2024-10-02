// import node module libraries
import { Fragment } from 'react';
import { Col, Row, Container, Form } from 'react-bootstrap';

// import widget/custom components
import { GeeksSEO } from 'widgets';

// import sub components 
import { JobPosterInfo, JobInfo, CompanyInfo } from 'sub-components';

// import your layout to override default layout 
import JobListingLayout from 'layouts/marketing/JobListingLayout';

const PostAJob = () => {
  return (
    <Fragment>
      {/* Geeks SEO settings  */}
      <GeeksSEO title="Post A Jobs | Geeks Nextjs Template" />

      <main>
        <section className="py-6 py-lg-12 bg-white">
          <Container>
            <Row>
              <Col md={12} lg={5}>
                <div className="mb-12">
                  <h1 className="display-4 mb-3 fw-bold">Post a job today</h1>
                  <p className="mb-0 lead">Ready to post a job for your company? Choose your job type below and fill all the job information</p>
                </div>
              </Col>
            </Row>
            {/* form */}
            <Form>
              <JobPosterInfo />
              <hr className="my-10" />
              <JobInfo />
              <hr className="my-10" />
              <CompanyInfo />
            </Form>
          </Container>
        </section>
      </main>
    </Fragment>

  )
}

PostAJob.Layout = JobListingLayout;

export default PostAJob