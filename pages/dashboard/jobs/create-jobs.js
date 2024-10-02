import { Row, Col, Container, Card } from 'react-bootstrap';
import { PageHeading } from 'widgets'

import AddNewJobs from 'sub-components/dashboard/jobs/CreateJobs';

const CreateJobs = () => {
  return (

    <Container>
    <Row>
        <Col xl={12} lg={12} md={12} sm={12}>
            <Card className="shadow-sm">
                <Card.Body>
                  <AddNewJobs />
                </Card.Body>
            </Card>
        </Col>
    </Row>
</Container>

  )
}

export default CreateJobs;
