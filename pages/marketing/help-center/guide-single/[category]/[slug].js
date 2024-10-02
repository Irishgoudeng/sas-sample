// import node module libraries
import React, { Fragment } from 'react';
import { Row, Col, Container, ListGroup, Card, Breadcrumb, Navbar } from 'react-bootstrap';
import { useRouter } from 'next/router'
import Link from 'next/link';

// import MDI icons
import Icon from '@mdi/react';
import { mdiArrowRight } from '@mdi/js';

// import widget/custom components
import { GeeksSEO } from 'widgets';

// import data files
import GuidesResourcesData from 'data/marketing/help-center/GuidesResourcesData';

// import your layout to override default layout 
import HelpCenterDarkLayout from 'layouts/marketing/HelpCenterDefaultLayout';

const HelpCenterGuideSingle = () => {
	const router = useRouter();
	const categoryslug = router.query.category;
	const articleslug = router.query.slug;

	return (
		<Fragment>
			{GuidesResourcesData.filter(function (dataSource) {
				return dataSource.categoryslug === categoryslug;
			}).map((item, index) => {
				return (
					<Fragment key={index}>
						{item.articles
							.filter(function (dataSource) {
								return dataSource.articleslug === articleslug;
							})
							.map((article, index) => {
								return (
									<Fragment key={index}>
										{/* Geeks SEO settings  */}
										<GeeksSEO
											title={article.articletitle}
											description={article.articletitle + ", Geeks Nextjs help center guide"}
										/>
										<section className="pt-3">
											<Container>
												<Row> 
													{/* breadcrumb */}
													<Col md={{ offset: 2, span: 8 }} xs={12}>
														<div>
															<Navbar aria-label="breadcrumb" bsPrefix=' '>
																<ListGroup as="ol" bsPrefix="breadcrumb">
																	<ListGroup.Item as="li" bsPrefix="breadcrumb-item">
																		<Link href="/marketing/help-center/">Help Center</Link>
																	</ListGroup.Item>
																	<ListGroup.Item as="li" bsPrefix="breadcrumb-item">
																		<Link href="/marketing/help-center/guide">Guides & Resources</Link>
																	</ListGroup.Item>
																	<ListGroup.Item as="li" bsPrefix="breadcrumb-item">
																		<Link href="/marketing/help-center/guide">{item.title}</Link>
																	</ListGroup.Item>
																	<ListGroup.Item as="li" bsPrefix="breadcrumb-item">
																		{article.articletitle}
																	</ListGroup.Item>
																</ListGroup>
															</Navbar>
														</div>
													</Col>
												</Row>
											</Container>
										</section>

										{/* article content */}
										<section className="py-10">
											<Container>
												<Row>
													<Col md={{ offset: 2, span: 8 }} xs={12}>
														<div className="mb-8">
															<h1 className="display-4 fw-semi-bold">
																{article.articletitle}
															</h1>
															<div
																className="mt-3"
																dangerouslySetInnerHTML={{
																	__html: article.content
																}}
															></div>
															<br />
															{/* was this article helpful ? */}
															<div className="d-md-flex justify-content-between align-items-center">
																<div className="mb-2 mb-md-0">
																	<p className="mb-0 fs-6">
																		Last updated 2 months ago
																	</p>
																</div>
																<div>
																	<h5 className="mb-0">
																		Was this article helpful?
																		<Link href="#" className="text-muted ms-2">
																			<i className="fe fe-thumbs-up"></i>
																		</Link>
																		<Link href="#" className="text-muted ms-2">
																			<i className="fe fe-thumbs-down"></i>
																		</Link>
																	</h5>
																</div>
															</div>
														</div>
													</Col>
												</Row>
											</Container>
										</section>
									</Fragment>
								);
							})}

						{/* related articles list */}
						<section className="pt-0 pb-10">
							<Container>
								<Row>
									<Col md={{ offset: 2, span: 8 }} xs={12}>
										<Card className="border">
											<Card.Body>
												<h3 className="mb-3 fw-semi-bold">Related articles</h3>
												<ListGroup
													as="ul"
													bsPrefix="list-unstyled"
													className="mb-0"
												>
													{item.articles
														.filter(function (dataSource) {
															return dataSource.articleslug !== articleslug;
														})
														.map((article, index) => {
															return (
																<ListGroup.Item
																	as="li"
																	className="mb-2"
																	bsPrefix=" "
																	key={index}
																>
																	<Link
																		href={`/marketing/help-center/guide-single/${item.categoryslug}/${article.articleslug}`}
																		className="text-body">
																		<Icon
																			path={mdiArrowRight}
																			className="me-1 text-muted"
																			size={0.6}
																		/>
																		{article.articletitle}
																	</Link>
																</ListGroup.Item>
															);
														})}
												</ListGroup>
											</Card.Body>
										</Card>
									</Col>
								</Row>
							</Container>
						</section>
					</Fragment>
				);
			})}
		</Fragment>
	);
};

HelpCenterGuideSingle.Layout = HelpCenterDarkLayout;

export default HelpCenterGuideSingle;
