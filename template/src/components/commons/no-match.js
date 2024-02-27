
// outsource dependencies
import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button } from 'reactstrap';

// local dependencies
import { HOME } from '../../constants';

export const NoMatch = memo(function NoMatch () {
  const location = useLocation();
  console.info(location);

  return <Container fluid id="NoMatch">
    <Row>
      <Col xs="12" tag="h1" className="title"> 404 </Col>
    </Row>
    <Row className="mb-5">
      <Col xs="12" tag="h4"> We are sorry, the page you requested cannot be found </Col>
    </Row>
    <Row>
      <Col xs="12">
        <Button
          outline
          tag={Link}
          color="primary"
          to={HOME.LINK()}
          className="rounded-pill btn-outline-fat"
        >
          GO TO HOMEPAGE
        </Button>
      </Col>
    </Row>
  </Container>;
});
